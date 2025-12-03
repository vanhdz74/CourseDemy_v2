import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { fetchCartThunk } from "../cart/cartThunk";
import { fetchRegisteredCourses } from "../my_course/myCourseThunk";

// ---- LOGIN ----
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return rejectWithValue(error.message || "Sai tài khoản hoặc mật khẩu");
      }

      const data = await res.json();
      const token = data.token;
      const decoded: any = jwtDecode(data.token);

      if (decoded.role === "STUDENT") {
        dispatch(fetchCartThunk({ userId: decoded.id, token }));
        dispatch(fetchRegisteredCourses({ userId: decoded.id, token }));
      }

      return data.token;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---- LOGOUT ----
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
});
