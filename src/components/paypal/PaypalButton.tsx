"use client";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";

import React from "react";
import { paypalCheckPaymentv, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const rountedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse ">
        <div className="h-11 bg-gray-300 rounded" />
        {/* <div className="h-11 bg-gray-300 rounded mt-2"/> */}
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: rountedAmount.toString(),
          },
        },
      ],
    });

    const res = await setTransactionId(orderId, transactionId);

    if (!res.ok) {
      throw new Error("No se pudo actualizar la orden");
    }

    return transactionId;
  };

  const onApprove = async(data: OnApproveData, actions: OnApproveActions):Promise<void>=>{    
    const details = await actions.order?.capture();
    if(!details)return;

    await paypalCheckPaymentv(details.id)

  }

  return (
    <div className="relative z-0">
      <PayPalButtons style={{ layout: "horizontal" }} createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
