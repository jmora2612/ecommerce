"use server";

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (FormData: FormData) => {
  const data = Object.fromEntries(FormData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();

  const { id, ...res } = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = res.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      if (id) {
        product = await prisma.product.update({
          where: { id },
          data: {
            ...res,
            sizes: { set: res.sizes as Size[] },
            tags: { set: tagsArray },
          },
        });
      } else {
        product = await prisma.product.create({
          data: {
            ...res,
            sizes: { set: res.sizes as Size[] },
            tags: { set: tagsArray },
          },
        });
      }

      // Carga de imagenes

      if (FormData.getAll("images")) {
        const images = await uploadImages(FormData.getAll("images") as File[]);
        if(!images) throw new Error('No se pudo cargar las imagenes, rollingback');

        await prisma.productImage.createMany({
          data: images.map( image => ({
            url: image!,
            productId: product.id,
          }))
        });

      }

      return {
        product,
      };
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/product/${product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    console.log("ERROR EN createUpdateProduct", error);
    return {
      ok: false,
      message: "No se pudo crear/actualizar el producto",
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (el) => {
      try {
        const buffer = await el.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((res) => res.secure_url);
      } catch (error) {
        console.log("ERROR EN uploadPromises", error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;
  } catch (error) {
    console.log("ERROR EN uploadImages", error);
    return null;
  }
};
