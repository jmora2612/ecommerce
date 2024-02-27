"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) return { ok: false, message: "No hay sesion de usuario" };

    const order = await prisma.order.findUnique({
      where: {
        userId,
        id,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            quantity: true,
            price: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw `${id} no existe`;

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw `${id} no es de ese usuario`;
      }
    }

    return {
      ok: true,
      order: order,
    };
  } catch (error) {
    console.log("Error al traer la orden en accion getOrderById");

    return {
      ok: false,
      message: "Error al traer la orden ",
    };
  }
};
