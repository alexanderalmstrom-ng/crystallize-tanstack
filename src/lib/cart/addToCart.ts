import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { refreshAuthTokenServerFn } from "../auth";

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

    const authToken = await refreshAuthTokenServerFn();

    return {
      authToken: authToken.token,
    };
  });
