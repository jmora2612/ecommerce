"use client";

import { useAddressStore, useCartStore } from "@/store";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { placeOrder } from "@/actions";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setisPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setisPlacingOrder(true);

    const productsToOrder = cart.map((el) => ({
      productId: el.id,
      quantity: el.quantity,
      size: el.size,
    }));

    const res = await placeOrder(productsToOrder, address);

    // Aqui dio error al crear la orden
    if (!res.ok) {
      setisPlacingOrder(false);
      setErrorMessage(res.message);
      return;
    }

    // Aqui se creo la orden
    clearCart();
     router.replace("/orders/" + res.order!.id);
  };

  if (!loaded) return <p>Cargando...</p>;

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
        <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
        <div className="mb-8">
          <p className="text-xl">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.address}</p>
          <p>{address.address2}</p>
          <p>{address.postalCode}</p>
          <p>
            {address.city}, {address.country}
          </p>
          <p>{address.phone}</p>
        </div>

        {/* divider */}

        <div className="w-full h-0.5 rounded bg-gray-200 mb-8" />

        <h2 className="text-2xl mb-2">Resumen de ordenes</h2>
        <div className="grid grid-cols-2">
          <span>No. Productos</span>
          <span className="text-right">
            {itemsInCart} {itemsInCart === 1 ? "artículo" : "artículos"}
          </span>

          <span>Subtotal</span>
          <span className="text-right">${subTotal.toFixed(2)}</span>

          <span>Impuestos</span>
          <span className="text-right">${tax.toFixed(2)}</span>

          <span className="text-2xl mt-5">Total:</span>
          <span className="text-right mt-5 text-2xl">${total.toFixed(2)}</span>
        </div>
        <div className="mt-5 w-full mb-2">
          <p className="mb-5">
            <span className="text-xs">
              Al hacer click en &quot;Colocar nombre&quot;, acepta nuestros
              <a href="#" className="underline">
                {" "}
                terminos y condiciones
              </a>{" "}
              y{" "}
              <a href="#" className="underline">
                politicas de privacidad
              </a>
            </span>
          </p>

          <p className="text-red-500 mb-1">{errorMessage}</p>
          <button
            //   href="/orders/123"
            onClick={() => onPlaceOrder()}
            className={clsx("w-full", {
              "btn-primary": !isPlacingOrder,
              "btn-disabled": isPlacingOrder,
            })}
          >
            Colocar orden
          </button>
        </div>
      </div>
    </>
  );
};
