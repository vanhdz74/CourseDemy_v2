import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async ({ userId, token }: { userId: number; token: string }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    return Array.isArray(data?.cart_items)
      ? data.cart_items.map((i: any) => i.course_id)
      : [];
  }
);
