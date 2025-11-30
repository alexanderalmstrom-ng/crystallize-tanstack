import type { ReactNode } from "react";

type ProductCardContentProps = {
  children: ReactNode;
};

export default function ProductCardContent({
  children,
}: ProductCardContentProps) {
  return <div className="flex flex-col gap-1 px-6 py-3">{children}</div>;
}
