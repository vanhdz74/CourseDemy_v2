// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import các slice
import courseReducer from "@/features/course/courseSlice";
import cartReducer from "@/features/cart/cartSlice";
import checkoutReducer from "@/features/checkout/checkoutSlice";
import myCourseReducer from "@/features/my_course/myCourseSlice";

export const store = configureStore({
  reducer: {
    course: courseReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    my_course: myCourseReducer,
  },
  devTools: true,
});

// Khai báo type cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
