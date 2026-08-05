// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import các slice
import courseReducer from "@/modules/course/store/courseSlice";
import cartReducer from "@/modules/cart/store/cartSlice";
import checkoutReducer from "@/modules/payment/store/checkoutSlice";
import myCourseReducer from "@/modules/course/store/myCourseSlice";

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
