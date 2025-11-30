import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { variantFragment } from "@/lib/discovery/fragments/variant.fragment";

export function resolveProductVariantsFragment(
  variants: (FragmentType<typeof variantFragment> | null)[] | null | undefined,
) {
  return variants?.map((variant) => getFragmentData(variantFragment, variant));
}

export function getVariantsWithSkuAndName(
  variants: (FragmentType<typeof variantFragment> | null)[] | null | undefined,
) {
  return resolveProductVariantsFragment(variants)?.filter(
    (
      variant,
    ): variant is NonNullable<typeof variant> & {
      sku: string;
      name: string;
    } =>
      variant !== null &&
      variant !== undefined &&
      variant.sku !== undefined &&
      variant.sku !== null &&
      variant.name !== undefined &&
      variant.name !== null,
  );
}
