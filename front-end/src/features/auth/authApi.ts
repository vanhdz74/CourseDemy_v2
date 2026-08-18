import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";
import type { RegisterPayload } from "@/services/users";

export type SendOtpRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiMessageResponse, RegisterPayload>({
      query: (payload) => ({
        url: endpoints.auth.register,
        method: "POST",
        data: payload,
      }),
    }),
    sendOtp: builder.mutation<ApiMessageResponse, SendOtpRequest>({
      query: (payload) => ({
        url: endpoints.auth.sendOtp,
        method: "POST",
        data: payload,
      }),
    }),
    verifyOtp: builder.mutation<ApiMessageResponse, VerifyOtpRequest>({
      query: (payload) => ({
        url: endpoints.auth.verifyOtp,
        method: "POST",
        data: payload,
      }),
    }),
    resetPassword: builder.mutation<ApiMessageResponse, ResetPasswordRequest>({
      query: (payload) => ({
        url: endpoints.auth.resetPassword,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
