import { createFileRoute, notFound } from "@tanstack/react-router";
import Price from "@/components/Price/Price";
import { Heading } from "@/components/ui/heading";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { getProductByPathServerFn } from "@/lib/discovery/product";
import { getVariantsWithSkuAndName } from "@/utils/variant";
import ProductGalleryCarousel from "./-components/ProductGalleryCarousel";

export const Route = createFileRoute("/product/$")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getProductByPathServerFn({
      data: { path: params._splat },
    });

    if (!product) {
      throw notFound();
    }

    return {
      product,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const { product } = Route.useLoaderData();
  const productVariants = getVariantsWithSkuAndName(product?.variants);
  const productVariantImages = productVariants?.flatMap(
    (variant) => variant?.images,
  );

  return (
    <div className="grid lg:grid-cols-[2fr_minmax(32rem,1fr)]">
      <ProductGalleryCarousel images={productVariantImages} />
      <ProductDetails product={product} />
    </div>
  );
}

function ProductDetails({ product }: { product: ProductFragment }) {
  return (
    <div className="px-4 py-6 lg:p-10 flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Heading asChild>
          <h1 className="text-2xl lg:text-4xl">{product.name}</h1>
        </Heading>
        <Price amount={product.defaultVariant?.defaultPrice} />
      </header>
    </div>
  );
}
