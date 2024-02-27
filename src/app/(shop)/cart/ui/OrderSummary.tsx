"use client";

import { useCartStore } from "@/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export const OrderSummary = () => {
  const {itemsInCart, subTotal, tax, total} = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
  }, []);

  if (!loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
      <h2 className="text-2xl mb-2">Resumen de ordenes</h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
            
          {itemsInCart} {itemsInCart === 1 ? 'artículo' : 'artículos'}
        </span>

        <span>Subtotal</span>
        <span className="text-right">${subTotal.toFixed(2)}</span>

        <span>Impuestos</span>
        <span className="text-right">${tax.toFixed(2)}</span>

        <span className="text-2xl mt-5">Total:</span>
        <span className="text-right mt-5 text-2xl">
          ${total.toFixed(2)}
        </span>
      </div>
      <div className="mt-5 w-full mb-2">
        <Link
          href="/checkout/address"
          className="flex btn-primary justify-center"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};
