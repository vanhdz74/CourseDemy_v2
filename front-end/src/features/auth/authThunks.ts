import { createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { fetchCartThunk } from "../cart/cartThunk";
import { fetchRegisteredCourses } from "../my_course/myCourseThunk";
import { JSEncrypt } from "jsencrypt";

//  ENCRYPT PASSWORD (RSA)
export async function encryptPassword(password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public-key`);
  const { publicKey } = await res.json();

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  const encrypted = encrypt.encrypt(password);
  return encrypted;
}

//  LOGIN
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Mã hóa password bằng RSA
      const encryptedPassword = await encryptPassword(credentials.password);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: encryptedPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return rejectWithValue(error.message || "Sai tài khoản hoặc mật khẩu");
      }

      const data = await res.json();

      const token = data.token;

      // Lưu token
      localStorage.setItem("token", token);

      // Decode JWT
      const decoded: any = jwtDecode(token);

      // Nếu học viên → load giỏ hàng + khóa học đã mua
      if (decoded.role === "STUDENT") {
        dispatch(fetchCartThunk({ userId: decoded.id, token: token }));
        dispatch(fetchRegisteredCourses({ userId: decoded.id, token: token }));
      }

      return token;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

//  LOGOUT
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});
