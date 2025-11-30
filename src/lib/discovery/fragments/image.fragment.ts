import { graphql } from "@/gql/discovery";

export const imageFragment = graphql(`
    fragment image on Image {
      url
      altText
      width
      height
    }
  `);
