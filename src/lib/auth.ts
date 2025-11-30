import z from "zod";
import { env } from "@/env";

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
        expiresIn: 2592000, // 30 days
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
