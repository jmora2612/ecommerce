"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const producsInCart = useCartStore((state) => state.cart);
  const removeProduct = useCartStore(
    (state) => state.removeProduct
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  if (!loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {producsInCart.map((el) => (
        <div key={`${el.slug}-${el.size}`} className="flex mb-5">
          <ProductImage
            src={el.image}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={el.title}
            className="mr-5 rounded"
          />

          <div>
            <Link className="hover:underline" href={`/product/${el.slug}`}>
              {el.size} - {el.title}
            </Link>
            <p>${el.price.toFixed(2)}</p>
            <QuantitySelector
              quantity={el.quantity}
              onQuantityChanged={(value) => updateProductQuantity(el, value)}
            />

            <button onClick={()=>removeProduct(el)} className="underline mt-3">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};
