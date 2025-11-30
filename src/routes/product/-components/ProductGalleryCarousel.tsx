import { Image } from "@unpic/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { FragmentType } from "@/gql/discovery";
import type { imageFragment } from "@/lib/discovery/fragments/image.fragment";
import { resolveImagesFragment } from "@/utils/images";

export default function ProductGalleryCarousel({
  images,
}: {
  images:
    | (FragmentType<typeof imageFragment> | null | undefined)[]
    | null
    | undefined;
}) {
  if (!images || images.length === 0) return null;

  const imagesWithUrl = resolveImagesFragment(images);

  if (!imagesWithUrl || imagesWithUrl.length === 0) return null;

  return (
    <Carousel className="bg-secondary" opts={{ align: "start", loop: true }}>
      <CarouselContent className="xl:h-[calc(100vh-6.4375rem)]">
        {imagesWithUrl.map((image) => {
          if (!image?.url) return null;

          return (
            <CarouselItem key={image.url} className="bg-secondary">
              <Image
                src={image.url}
                width={image.width ?? 2000}
                height={image.height ?? 2000}
                alt={image.altText ?? ""}
                className="w-full h-full object-contain aspect-square mix-blend-multiply"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
