import z from "zod";

export default {
  tenantId: z.string().parse(process.env.CRYSTALLIZE_TENANT_IDENTIFIER),
  accessTokenId: z.string().parse(process.env.CRYSTALLIZE_ACCESS_TOKEN_ID),
  accessTokenSecret: z
    .string()
    .parse(process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET),
};
