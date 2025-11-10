import CartItemDisplay from "@/components/cart/CartItemDisplay";
import React from "react";

const Cart = () => {
  return (
    <div>
      <h2 className="text-3xl mb-4">Giỏ hàng</h2>
      <CartItemDisplay />
    </div>
  );
};

export default Cart;
