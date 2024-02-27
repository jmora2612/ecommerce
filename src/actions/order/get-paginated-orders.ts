"use service";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
  try {
    const session = await auth();

    const userRole = session?.user.role;

    if (userRole !== 'admin') return { ok: false, message: "Debe estar autenticado" };

    const getOrders = await prisma.order.findMany({
      orderBy:{
        createdAt:'desc'
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
