"use client";

import { useApi } from "@/modules/shared/hooks/useApi";
import React, { useState } from "react";

type OtpResponse = {
  message?: string;
};

type ApiError = {
  message?: string;
};

export default function GetPassword() {
  const { post } = useApi();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

  /* ===== STEP 1: SEND OTP ===== */
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) return setError("Vui lòng nhập email");
    if (!validateEmail(email)) return setError("Email không hợp lệ");

    setLoading(true);

    try {
      const data = await post<OtpResponse>("/send-otp", { email });
      // BE trả: { message: "OTP đã được gửi" }

      setSuccess(data.message || "OTP đã được gửi");
      setStep(2);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.message || "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  /* ===== STEP 2: VERIFY OTP ===== */
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) return setError("Vui lòng nhập OTP");

    setLoading(true);

    try {
      const data = await post<OtpResponse>("/verify-otp", {
        email,
        otp,
      });
      // BE trả: { message: "OTP đúng. Mật khẩu mới đã được gửi về email" }

      setSuccess(data.message || "OTP đúng. Mật khẩu mới đã được gửi về email");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.message || "OTP không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Lấy lại mật khẩu
        </h1>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded mb-4 text-green-800">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded mb-4 text-red-700">
            {error}
          </div>
        )}

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <form onSubmit={sendOtp}>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="you@example.com"
            />

            <button
              disabled={loading}
              className="w-full py-2 rounded-lg text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-60"
            >
              {loading ? "Đang gửi OTP..." : "Gửi OTP"}
            </button>
          </form>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <p className="text-sm text-slate-500 mb-3">
              Nhập mã OTP đã gửi tới <b>{email}</b>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 text-center tracking-widest"
              placeholder="Nhập OTP"
            />

            <button
              disabled={loading}
              className="w-full py-2 rounded-lg text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-60"
            >
              {loading ? "Đang xác minh..." : "Xác minh OTP"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center text-sm">
          <a href="/login" className="underline text-slate-500">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
