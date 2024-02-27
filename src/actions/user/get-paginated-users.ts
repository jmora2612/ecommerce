"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  try {
    const session = await auth();

    if (session?.user.role !== "admin")
      return { ok: false, message: "Debe tener un rol administrador" };

    const users = await prisma.user.findMany({
      orderBy: { name: "desc" },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.log("Error en getPaginatedUsers", error);
  }
};
