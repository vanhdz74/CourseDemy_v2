// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";

// Import các slice
import authReducer from "@/features/auth/authSlice";
import courseReducer from "@/features/course/courseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
  devTools: true,
});

// Khai báo type cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
