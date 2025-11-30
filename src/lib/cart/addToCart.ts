import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import z from "zod";
import { env } from "@/env";
import { AUTH_TOKEN_EXPIRATION_TIME, decrypt, encrypt } from "@/utils/auth";
import { getBaseURL } from "@/utils/common";

const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

export const addToCartServerFn = createServerFn({ method: "POST" })
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data }) => {
    console.log("data", data);

    const coookieToken = z.string().min(1).safeParse(getCookie("token"));

    if (!coookieToken.success) {
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

      console.log("authTokenResponse", authTokenResponse);

      const encryptedToken = await encrypt({
        token: authTokenResponse.token,
      });

      setCookie("token", encryptedToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        httpOnly: true,
        maxAge: AUTH_TOKEN_EXPIRATION_TIME,
      });

      console.log("encryptedToken", encryptedToken);
      return;
    }

    const decryptedToken = await decrypt(coookieToken.data);

    console.log("decryptedToken", decryptedToken);
  });
