import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ProductCardTitleProps = ComponentProps<"h3">;

export default function ProductCardTitle({
  children,
  className,
}: ProductCardTitleProps) {
  return <h3 className={cn("", className)}>{children}</h3>;
}
