import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";
import { env } from "@/env";
import { AUTH_TOKEN_EXPIRATION_TIME, decrypt, encrypt } from "@/utils/auth";
import { getBaseURL } from "@/utils/common";

const AuthTokenResponseSchema = z
  .object({
    success: z.literal(true),
    token: z.string(),
  })
  .or(
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  );

export async function fetchAuthToken() {
  const response = await fetch(
    `https://shop-api.crystallize.com/${env.CRYSTALLIZE_TENANT_IDENTIFIER}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": env.CRYSTALLIZE_ACCESS_TOKEN_ID,
        "X-Crystallize-Access-Token-Secret":
          env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
      },
      body: JSON.stringify({
        scopes: ["cart", "cart:admin"],
        expiresIn: AUTH_TOKEN_EXPIRATION_TIME,
      }),
    },
  );

  const authTokenValidation = AuthTokenResponseSchema.safeParse(
    await response.json(),
  );

  if (!authTokenValidation.success) {
    throw new Error("Failed to validate auth token response", {
      cause: authTokenValidation.error.message,
    });
  }

  if ("error" in authTokenValidation.data) {
    throw new Error("Failed to fetch auth token", {
      cause: authTokenValidation.data.error,
    });
  }

  return authTokenValidation.data.token;
}

export const getAuthTokenServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const coookieToken = z.string().min(1).safeParse(getCookie("token"));

  // If the cookie does not exist as a cookie, create a new token and set it in a new cookie
  if (!coookieToken.success) {
    const response = await refreshAuthTokenServerFn();

    return {
      token: response.token,
    };
  }

  // Check if the token is valid and has not expired, if not, refresh the token
  try {
    await decrypt(coookieToken.data);

    return {
      token: coookieToken.data,
    };
  } catch {
    const refreshTokenResponse = await refreshAuthTokenServerFn();

    return {
      token: refreshTokenResponse.token,
    };
  }
});

export const refreshAuthTokenServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const response = await fetch(`${getBaseURL()}/api/auth-token`, {
    method: "POST",
    body: JSON.stringify({
      secret: env.AUTH_TOKEN_API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch auth token");
  }

  const authTokenResponse = await z
    .object({ token: z.string() })
    .parse(await response.json());

  const encryptedToken = await encrypt({
    token: authTokenResponse.token,
  });

  setCookie("token", encryptedToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: AUTH_TOKEN_EXPIRATION_TIME,
  });

  return {
    token: encryptedToken,
  };
});
