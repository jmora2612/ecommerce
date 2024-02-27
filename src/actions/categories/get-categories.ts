"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const session = await auth();

    const userRole = session?.user.role;

    if (userRole !== "admin")
      return { ok: false, message: "Debe estar autenticado" };

    const categories = await prisma.category.findMany({orderBy:{name:'desc'}});

    return{
        ok:true,
        categories
    }


  } catch (error) {
    console.log("error en el actions de getOrdersByUser", error);
    return {
      ok: false,
      message: "Error al traer las ordenes del usuario",
    };
  }
};
