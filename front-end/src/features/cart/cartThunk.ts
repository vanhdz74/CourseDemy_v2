import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartCourseIds } from "@/services/cart";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async ({ userId }: { userId: number }) => getCartCourseIds(userId)
);
