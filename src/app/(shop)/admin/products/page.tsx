export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginateProductsWithImages, getPaginatedOrders } from "@/actions";
import { Pagination, ProductImage, Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  searchParams: {
    page: string;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPage } =
    await getPaginateProductsWithImages({ page });
  return (
    <>
      <Title title="Mantenimiento de productos" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/product/new" className="btn-primary">
          Nuevo Producto
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Titulo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Genero
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Inventario
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products!.map((el) => (
              <tr
                key={el.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${el.slug}`}>
                  <ProductImage
                      src={ el.ProductImage[0]?.url }
                      width={80}
                      height={80}
                      alt={el.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </Link>
                  
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/product/${el.slug}`} className="hover:underline">
                    {el.title}
                  </Link>
                </td>
                <td className=" text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.price.toFixed(2)}
                </td>

                <td className=" text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {el.gender}
                </td>

                <td className=" text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {el.inStock}
                </td>

                <td className=" text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {el.sizes.join(', ')}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPage} />
      </div>
    </>
  );
}
