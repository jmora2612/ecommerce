import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      //Methods
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // Revisar si el producto existe en el carrito con la talla seleccionada

        const productInCart = cart.some(
          (el) => el.id === product.id && el.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // Se que el producto exise por talla, se debe incrementar

        const updateCartProducts = cart.map((el) => {
          if (el.id === product.id && el.size === product.size) {
            return { ...el, quantity: el.quantity + product.quantity };
          }
          return el;
        });

        set({ cart: updateCartProducts });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updateQuantity = cart.map((el) => {
          if (el.size === product.size && el.id === product.id) {
            return { ...el, quantity };
          }
          return el;
        });
        set({ cart: updateQuantity });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();
        const newProducts = cart.filter(
          (el) => el.id !== product.id || el.size !== product.size
        );
        set({ cart: newProducts });
      },
      getSummaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal,
          0
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
