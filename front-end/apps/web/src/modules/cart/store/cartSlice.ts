import { createSlice } from "@reduxjs/toolkit";
import { fetchCartThunk } from "./cartThunk";

interface CartState {
  items: number[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
