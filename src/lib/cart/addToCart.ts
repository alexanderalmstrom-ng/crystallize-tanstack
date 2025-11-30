import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { authTokenMiddleware } from "../auth";

const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

export const addToCartServerFn = createServerFn({ method: "POST" })
  .middleware([authTokenMiddleware])
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data, context }) => {
    console.log("data", data);

    return {
      data,
      context,
    };
  });
