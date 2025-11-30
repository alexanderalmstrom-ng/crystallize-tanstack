import { graphql } from "@/gql/discovery";

export const variantFragment = graphql(`
  fragment variant on ProductVariantForProduct {
    name
    sku
    attributes
    isDefault
    defaultPrice
    priceVariants
    images {
      ...image
    }
    attributes
  }
`);
