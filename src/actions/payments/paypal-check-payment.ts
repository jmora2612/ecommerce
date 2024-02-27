"use server";

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPaymentv = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener token de verificacion",
    };
  }

  const resp = await verifyPayPalPayment(transactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: "Error al verificar el pago",
    };
  }

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];
  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Aun no se ha pagado en paypal",
    };
  }
  try {
    await prisma.order.update({
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
      where: {
        id: orderId,
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "500 - El pago no se pudo realizar",
    };
  }
};

const getPaypalBearerToken = async () => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store",
    }).then((res) => res.json());

    return result.access_token;
  } catch (error) {
    console.log("Error en getPaypalBearerToken", error);
  }
};

const verifyPayPalPayment = async (
  transactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | undefined> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const result = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
    }).then((res) => res.json());

    return result;
  } catch (error) {
    console.log("Error en verifyPayPalPayment", error);
  }
};
