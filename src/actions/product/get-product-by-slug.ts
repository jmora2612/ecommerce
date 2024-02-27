"use server";

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: true,
      },
      where: {
        slug,
      },
    });

    if (!product) return null;

    return {
      ...product,
      images: product.ProductImage.map((img) => img.url),
    };
  } catch (error) {
    throw new Error("Error al optener producto por slug");
  }
};
