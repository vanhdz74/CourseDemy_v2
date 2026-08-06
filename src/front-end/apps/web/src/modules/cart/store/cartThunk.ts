import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartCourseIds } from "@repo/api";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async ({ userId }: { userId: number }) => getCartCourseIds(userId)
);
