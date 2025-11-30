import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductCardLinkProps = {
  className?: string;
  children?: ReactNode;
  slug: string;
};

export default function ProductCardLink({
  children,
  className,
  slug,
  ...props
}: ProductCardLinkProps) {
  return (
    <Link
      className={cn("flex flex-col", className)}
      to={`/product/$slug`}
      params={{ slug }}
      {...props}
    >
      {children}
    </Link>
  );
}
