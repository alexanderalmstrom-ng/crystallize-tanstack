import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { imageFragment } from "@/lib/discovery/fragments/image.fragment";

export function resolveImagesFragment(
  images:
    | (FragmentType<typeof imageFragment> | null | undefined)[]
    | null
    | undefined,
) {
  if (!images) return undefined;

  return images
    .map((image) => getFragmentData(imageFragment, image))
    .filter((image) => image?.url);
}
