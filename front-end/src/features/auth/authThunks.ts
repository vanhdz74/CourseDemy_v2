import { createAsyncThunk } from "@reduxjs/toolkit";
import { useApi } from "@/hooks/useApi";

const { post } = useApi();

// ---- LOGIN ----
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
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
