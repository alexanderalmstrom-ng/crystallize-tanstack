import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getFragmentData, graphql } from "@/gql/discovery";
import { normalizeSlug } from "@/utils/common";
import { crystallizeDiscovery } from "../crystallize/client";
import { productFragment } from "./fragments/product.fragment";

export const getProductsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const products = await crystallizeDiscovery({
    query: graphql(`
      query GetProducts {
        browse {
          product {
            hits {
              id
              name
              path
            }
          }
        }
      }
    `),
  });

  return products?.data?.browse?.product?.hits;
});

export const getProductByPathServerFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ path: z.string().default("/") }))
  .handler(async ({ data: { path } }) => {
    const product = await crystallizeDiscovery({
      variables: { path: normalizeSlug(path) },
      query: graphql(`
          query GetProductByPath($path: String!) {
            browse {
              product(path: $path) {
                hits {
                  ...product
                }
              }
            }
          }
        `),
    });

    return getFragmentData(
      productFragment,
      product?.data?.browse?.product?.hits?.[0],
    );
  });
