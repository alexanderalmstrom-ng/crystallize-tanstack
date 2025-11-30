import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type HeadingTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = ComponentProps<HeadingTypes> & {
  as?: HeadingTypes;
  asChild?: boolean;
};

function Heading({
  children,
  className,
  as = "h2",
  asChild,
  ...props
}: HeadingProps) {
  const Component = asChild ? Slot : as;

  return (
    <Component className={cn("tracking-tight", className)} {...props}>
      {children}
    </Component>
  );
}

export { Heading };
