"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (orderId:string, transactionId:string) => {
  try {
    const res = await prisma.order.update({
      data: {
        transactionId,
      },
      where: {
        id: orderId,
      },
    });

    if(!res){
        return{
            ok:false,
            message:`No se encontro una orden con el id ${orderId}`
        }
    }

    return {
      ok: true,
      res,
    };
  } catch (error) {
    console.log("ERROR EN setTransactionId", error);

    return {
      ok: false,
      message: "Error en guardar id en transaccion en order",
    };
  }
};
