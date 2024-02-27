"use server";

import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith("http"))
    return { ok: false, message: "No se puede eliminar de fs" };
  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";

  try {
    await cloudinary.uploader.destroy(imageName);
    const deleatedImage = await prisma.productImage.delete({
      where: { id: imageId }, select:{
        product:{select:{slug:true}}
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deleatedImage.product.slug}`);
    revalidatePath(`/product/${deleatedImage.product.slug}`);

  } catch (error) {
    console.log("Error en deleteProductImage", error);
    return{ok:false, message:"error al eliminar las imagenes"}
  }
};
