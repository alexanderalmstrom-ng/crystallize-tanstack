import { buildClientSchema, getIntrospectionQuery } from "graphql";
import z from "zod";
import codegenConfig from "./codegen.config.mts";

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

export default async () => {
  const introspectionQuery = getIntrospectionQuery();

  const cartTokenResponse = await fetch(
    `https://shop-api.crystallize.com/${codegenConfig.tenantId}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": codegenConfig.accessTokenId,
        "X-Crystallize-Access-Token-Secret": codegenConfig.accessTokenSecret,
      },
      body: JSON.stringify({
        scopes: ["cart", "cart:admin"],
        expiresIn: 18000, // 5 hours
      }),
    },
  );

  const cartTokenValidation = AuthTokenResponseSchema.safeParse(
    await cartTokenResponse.json(),
  );

  if (!cartTokenValidation.success) {
    console.error(
      "Failed to validate cart token response",
      cartTokenValidation.error,
    );
    throw new Error(cartTokenValidation.error.message);
  }

  if ("error" in cartTokenValidation.data) {
    console.error("Failed to fetch cart token", cartTokenValidation.data.error);
    throw new Error(cartTokenValidation.data.error);
  }

  const cartResponse = await fetch(
    `https://shop-api.crystallize.com/${codegenConfig.tenantId}/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": codegenConfig.accessTokenId,
        "X-Crystallize-Access-Token-Secret": codegenConfig.accessTokenSecret,
        Authorization: `Bearer ${cartTokenValidation.data.token}`,
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    },
  );

  const cartData = await cartResponse.json();

  return buildClientSchema(cartData.data);
};
