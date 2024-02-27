"use client";

import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore(state=>state.addProductToCart)
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);

    if(!size) return
    const cartProduct:CartProduct ={
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0]
    }
    addProductToCart(cartProduct);
    setAdded(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {added && !size && (
        <span className="text-red-500 fade-in">Debe seleccionar una talla</span>
      )}

      <SizeSelector
        selectedSize={size}
        availableSize={product.sizes}
        onSizeChanged={(size) => setSize(size)}
      />

      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={(quantity) => setQuantity(quantity)}
      />

      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
