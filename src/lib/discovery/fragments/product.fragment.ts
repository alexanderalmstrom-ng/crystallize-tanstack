import { graphql } from "@/gql/discovery";

export const productFragment = graphql(`
  fragment product on product {
    id
    name
    breadcrumbs {
      name
      path
    }
    defaultVariant {
      defaultPrice
    }
    variants {
      ...variant
    }
  }
`);
