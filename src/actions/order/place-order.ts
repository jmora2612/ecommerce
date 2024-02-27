"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) return { ok: false, message: "No hay sesion de usuario" };

  //Obtener informacion de los productos

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((el) => el.productId),
      },
    },
  });

  //Calcular montos

  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  //   Totales de tax, subTotal y total
  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const producQuantity = item.quantity;
      const product = products.find((el) => el.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * producQuantity;
      totals.subTotal += subTotal;

      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  try {
    //Crear la transaccion de la db

    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar stock de los productos

      const updateProductsPromises = products.map((el) => {
        // acumular valores
        const productQuantity = productIds
          .filter((f) => f.productId === el.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0)
          throw new Error(`${el.id} no tienen cantidad definida`);

        return tx.product.update({
          where: { id: el.id },
          data: { inStock: { decrement: productQuantity } },
        });
      });

      const updateProducts = await Promise.all(updateProductsPromises);

      // verificar valores negativos, significa no hay stock
      updateProducts.forEach((element) => {
        if (element.inStock < 0) {
          throw new Error(`${element.title} no tiene inventario suficiente`);
        }
      });

      //2. Crear la order - Encabezado - Detalles

      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((el) => ({
                quantity: el.quantity,
                size: el.size,
                productId: el.productId,
                price: products.find((x) => x.id === el.productId)?.price ?? 0,
              })),
            },
          },
        },
      });

      //3. Crear direccion de la orden

      const { country, ...res } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...res,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order,
        orderAddress,
        updateProducts,
      };
    });

    return {
        ok:true,
        order: prismaTx.order,
        prismaTx
    }
  } catch (error: any) {
    console.log("error en actions placeOrder", error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
