export const revalidate = 604800; //revalidado en 7 dias

import { getProductBySlug } from "@/actions";
import {
  ProductMovilSlideShow,
  ProductSlideShow,
  StockLabel,
} from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.slug ?? "Producto no encontrado",
    description: product?.description ?? "Producto no encontrado",
    openGraph: {
      title: product?.slug ?? "Producto no encontrado",
      description: product?.description ?? "Producto no encontrado",
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">
        {/* movil Slideshow */}
        <ProductMovilSlideShow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />

        {/* desktop Slideshow */}
        <ProductSlideShow
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
      </div>
      {/* detalles */}

      <div className="col-span-1 px-5">
        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product?.title}
        </h1>
        <p className="text-lg mb-5">${product?.price.toFixed(2)}</p>

        <AddToCart product={product}/>

        <h3 className="font-bold text-sm">Descripcion</h3>
        <p className="font-light">{product?.description}</p>
      </div>
    </div>
  );
}
