import type { FormEvent } from "react";
import z from "zod";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { addToCartServerFn } from "@/lib/cart/addToCart";
import { getVariantsWithSkuAndName } from "@/utils/variant";

export default function ProductForm({ product }: { product: ProductFragment }) {
  const variants = getVariantsWithSkuAndName(product?.variants);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const sku = z.string().parse(formData.get("sku"));
    const quantity = z.string().parse(formData.get("quantity"));

    addToCartServerFn({
      data: { items: [{ sku, quantity: Number(quantity) }] },
    }).then((data) => {
      console.log("data", data);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="sku" value={variants?.[0]?.sku ?? ""} />
      <input type="number" name="quantity" defaultValue={1} />
      <button type="submit">Add to cart</button>
    </form>
  );
}
