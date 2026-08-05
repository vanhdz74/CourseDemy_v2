import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  courses: number[];
}

const initialState: CheckoutState = {
  courses: [],
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutCourses: (state, action: PayloadAction<number[]>) => {
      state.courses = action.payload;
    },
    clearCheckoutCourses: (state) => {
      state.courses = [];
    },
  },
});

export const { setCheckoutCourses, clearCheckoutCourses } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
