import { OrderStatus, PaypalButton, ProductImage, Title } from "@/components";
import { getOrderById } from "@/actions";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order!.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order!.isPaid} />

            {order!.OrderItem.map((el) => (
              <div key={el.product.slug + "-" + el.size} className="flex mb-5">
                <ProductImage
                  src={el.product.ProductImage[0].url}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={el.product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <span>
                    {el.size} - {el.product.title} ({el.quantity})
                  </span>
                  <p className="font-bold">
                    ${(el.price * el.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* checkout */}

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2 font-bold">Direccion de entrega</h2>
            <div className="mb-8">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city}, {address!.countryId}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-8" />

            <h2 className="text-2xl mb-2">Resumen de ordenes</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order!.itemsInOrder}{" "}
                {order!.itemsInOrder === 1 ? "artículo" : "artículos"}
              </span>

              <span>Subtotal</span>
              <span className="text-right">${order!.subTotal.toFixed(2)}</span>

              <span>Impuestos</span>
              <span className="text-right">${order!.tax.toFixed(2)}</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-right mt-5 text-2xl">
                ${order!.total.toFixed(2)}
              </span>
            </div>
            <div className="mt-5 w-full mb-2">
              {order?.isPaid ? (
                <OrderStatus isPaid={order!.isPaid} />
              ) : (
                <PaypalButton orderId={order!.id} amount={order!.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
