import { initialData } from "./seed";
import prisma from "../lib/prisma";
import { countries } from "./seed-countries";

export async function main() {
  //1-borrar registros viejos

  //   await Promise.all([
    

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  //   ]);

  const { categories, products, users } = initialData;

  //Country
  await prisma.country.createMany({
    data:countries
  })

  //Users
  await prisma.user.createMany({
    data: users,
  });

  //Categorias

  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, categories) => {
    map[categories.name.toLowerCase()] = categories.id;
    return map;
  }, {} as Record<string, string>);

  //Productos
  products.forEach(async (el) => {
    const { images, type, ...rest } = el;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    //Imagenes

    const imagesData = images.map((el) => ({
      url: el,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
