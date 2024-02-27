"use server";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?:Gender;
}

export const getPaginateProductsWithImages = async ({
  page = 1,
  take = 12,
  gender
}: PaginationOptions) => {

  
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      where: {
        gender
      },
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
    });

    const totalCount = await prisma.product.count({where:{gender}});
    const totalPage = Math.ceil(totalCount / take)

    return {
      currentPage: page,
      totalPage,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((img) => img.url),
      })),
    };
  } catch (error) {
    console.log("error", error);
    throw new Error("No se pudo cargar los productos");
  }
};
