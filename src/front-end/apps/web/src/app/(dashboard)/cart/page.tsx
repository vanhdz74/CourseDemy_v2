"use client";

import CartItemDisplay from "@/modules/cart/components/cart/CartItemDisplay";
import { useI18n } from "@/modules/shared/i18n";
import React from "react";

const Cart = () => {
  const { t } = useI18n();

  return (
    <div>
      <h2 className="text-3xl mb-4">{t("cart.title")}</h2>
      <CartItemDisplay />
    </div>
  );
};

export default Cart;
