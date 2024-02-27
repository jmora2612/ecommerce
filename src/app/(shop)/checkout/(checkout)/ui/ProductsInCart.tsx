"use client";

import { ProductImage } from "@/components";
import { useCartStore } from "@/store";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const producsInCart = useCartStore((state) => state.cart);
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
            <span>
              {el.size} - {el.title} ({el.quantity})
            </span>
            <p className="font-bold">${(el.price * el.quantity).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </>
  );
};
