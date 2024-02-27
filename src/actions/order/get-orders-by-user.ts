"use service";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
  try {
    const session = await auth();

    const userId = session?.user.id;

    if (!userId) return { ok: false, message: "No hay sesion de usuario" };

    const getOrders = await prisma.order.findMany({
      where: {
        userId,
      },
      include:{
        OrderAddress:{
            select:{
               firstName:true,
               lastName:true 
            }
        }
      }
      
    });

    return{
        ok:true,
        getOrders
    }

  } catch (error) {
    console.log("error en el actions de getOrdersByUser", error);
    return {
      ok: false,
      message: "Error al traer las ordenes del usuario",
    };
  }
};
