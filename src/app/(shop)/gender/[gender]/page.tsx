export const revalidate = 60;

import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/interfaces";
import { redirect } from "next/navigation";

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPage } =
    await getPaginateProductsWithImages({ page, gender });

  const label: Record<Gender, string> = {
    men: "para Hombres",
    women: "para Mujeres",
    kid: "para Niño",
    unisex: "para todos",
  };

  if(products.length === 0) redirect(`/gender/${gender}`)

  return (
    <>
      <Title
        title={`Articulos ${label[gender]}`}
        subtitle={`Todos los productos ${label[gender]}`}
        className="mb-2"
      />

      <ProductGrid products={products} />
      <Pagination totalPages={totalPage} gender={gender} />
    </>
  );
}
