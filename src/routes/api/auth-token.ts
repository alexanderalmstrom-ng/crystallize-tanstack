import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { env } from "@/env";
import { AUTH_TOKEN_EXPIRATION_TIME } from "@/utils/auth";

export const Route = createFileRoute("/api/auth-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestData = await request.json();

        if (requestData.secret !== env.AUTH_TOKEN_API_SECRET) {
          return new Response("Unauthorized", { status: 401 });
        }

        const authToken = await fetchAuthTokenServerFn();

        return new Response(JSON.stringify({ token: authToken }));
      },
    },
  },
});

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

const fetchAuthTokenServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
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
  },
);
