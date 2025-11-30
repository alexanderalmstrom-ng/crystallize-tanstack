import type { ComponentProps } from "react";
import ProductCardLink from "./ProductCardLink";

type ProductCardProps = ComponentProps<typeof ProductCardLink>;

export default function ProductCard({
  children,
  slug,
  ...props
}: ProductCardProps) {
  return (
    <ProductCardLink className="flex flex-col" slug={slug} {...props}>
      {children}
    </ProductCardLink>
  );
}
