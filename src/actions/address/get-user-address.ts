"use server";

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const addressUser = await getAddress(userId);
    return {
        ok: true,
        address:addressUser
    }
  } catch (error) {
    console.log("error en setUserAddres", error);
    return {
      ok: false,
      message: "Error al traer los datos de la direccion del usuario",
    };
  }
};

const getAddress = async (userId: string) => {
  try {
    const addressUser = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    return addressUser;
  } catch (error) {
    console.log("Error en getAddress en action", error);
    throw "Error al traer los datos de la direccion del usuario";
  }
};
