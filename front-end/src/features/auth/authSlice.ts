import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUserThunk, logoutThunk } from "./authThunks";
import { jwtDecode } from "jwt-decode";


// Interface định nghĩa user lấy từ payload token
import { User } from "@/types/userType";

//  Interface định nghĩa cấu trúc state
interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

//  State khởi tạo
const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

//  Tạo Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Dùng khi reload trang (ReduxProvider khôi phục)
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    //  LOGIN
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.token = action.payload;

          try {
            // Giải mã token lấy thông tin user
            const decodedUser = jwtDecode<User>(action.payload);
            state.user = decodedUser;

            // Lưu localStorage
            localStorage.setItem("token", action.payload);
            localStorage.setItem("user", JSON.stringify(decodedUser));
          } catch {
            console.error("Token không hợp lệ");
          }
        }
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Đăng nhập thất bại";
      });

    //  LOGOUT
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });
  },
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
