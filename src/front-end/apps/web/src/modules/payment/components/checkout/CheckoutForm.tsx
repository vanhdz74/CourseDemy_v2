"use client";

import React, { useState } from "react";
import { Course } from "@repo/contracts";
import Image from "next/image";
import { Button } from "@/modules/shared/components/ui/button";
import Link from "next/link";
import { useApi } from "@/modules/shared/hooks/useApi";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useI18n } from "@/modules/shared/i18n";
import {
  CheckCircle2,
  Circle,
  CreditCard,
  GraduationCap,
  HelpCircle,
  Laptop,
  Loader2,
  Lock,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/modules/shared/lib/utils";

interface CheckoutFormProps {
  courseItems: Course[];
}

type PaymentResponse = {
  paymentUrl: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
};

const PAYMENT_METHODS = [
  {
    id: "vnpay",
    name: "Cổng VNPAY (QR, ATM, Visa, Master)",
    description: "Quét mã VNPAY-QR bằng ứng dụng Ngân hàng / Ví điện tử hoặc dùng thẻ ATM nội địa / Quốc tế.",
    badge: "Khuyên dùng • Tức thì",
    icon: QrCode,
    isAvailable: true,
  },
  {
    id: "momo",
    name: "Ví điện tử MoMo (Sandbox)",
    description: "Thanh toán siêu tốc quét mã MoMo hoặc chuyển đến ứng dụng/web MoMo.",
    badge: "MoMo Test",
    icon: Zap,
    isAvailable: true,
  },
  {
    id: "qr",
    name: "Chuyển khoản Ngân hàng (Mã QR Tự Sinh)",
    description: "Quét mã QR chuyển khoản trực tiếp, hỗ trợ xác nhận demo tức thì.",
    badge: "Miễn phí • Demo",
    icon: QrCode,
    isAvailable: true,
  },
  {
    id: "credit-card",
    name: "Thẻ Tín dụng / Ghi nợ Quốc tế (Stripe)",
    description: "Hỗ trợ thẻ Visa, Mastercard, JCB toàn cầu bảo mật cao.",
    badge: "Sắp ra mắt",
    icon: CreditCard,
    isAvailable: false,
  },
];

const CheckoutForm: React.FC<CheckoutFormProps> = ({ courseItems }) => {
  const { t } = useI18n();
  const { post } = useApi();
  const { data: session } = useSession();
  const user = session?.user;

  // Default to vnpay for seamless 1-click experience
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const rawTotalAmount = Array.isArray(courseItems)
    ? courseItems.reduce((sum, item) => sum + Number(item.price), 0)
    : 0;

  const discountAmount = Math.round((rawTotalAmount * discountPercent) / 100);
  const finalTotalAmount = Math.max(0, rawTotalAmount - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME2026" || code === "COURSEDEMY" || code === "VIP20") {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      toast.success(`Đã áp dụng mã giảm giá ${code} (-20%)!`);
    } else if (code === "REACT10" || code === "DISCOUNT10") {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      toast.success(`Đã áp dụng mã giảm giá ${code} (-10%)!`);
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Đã hủy áp dụng mã giảm giá");
  };

  const [qrModalData, setQrModalData] = useState<{
    qrCode: string;
    transactionNo: string;
    amount: number;
  } | null>(null);
  const [isVerifyingQr, setIsVerifyingQr] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error(t("checkout.selectPaymentMethod"));
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        courseIds: courseItems.map((item) => item.id),
        courseId: courseItems.map((item) => item.id),
        userId: user?.id,
        paymentMethod,
        totalPrice: finalTotalAmount,
      };

      const payment = await post<Record<string, any>>(
        `/api/payment/create?provider=${paymentMethod}`,
        body
      );

      const resData = payment?.data || payment;

      if (paymentMethod === "qr") {
        const qrCode = resData?.qrCode;
        const transactionNo = resData?.transactionNo;
        if (qrCode) {
          setQrModalData({
            qrCode,
            transactionNo: transactionNo || "",
            amount: finalTotalAmount,
          });
          setIsSubmitting(false);
          return;
        }
      }

      const paymentUrl = resData?.paymentUrl;

      if (!paymentUrl) {
        toast.error(t("checkout.missingPaymentUrl"));
        setIsSubmitting(false);
        return;
      }

      toast.success(t("checkout.redirecting"));
      window.location.assign(paymentUrl);
    } catch (error: unknown) {
      setIsSubmitting(false);
      const apiError = error as ApiError;
      const msg =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        t("checkout.genericError");
      toast.error(msg);
    }
  };

  const handleConfirmQrPayment = async () => {
    if (!qrModalData?.transactionNo) return;
    setIsVerifyingQr(true);
    try {
      await post(`/api/payment/qr/${qrModalData.transactionNo}/mock-success`);
      toast.success("Thanh toán thành công! Khóa học đã được kích hoạt.");
      setTimeout(() => {
        window.location.href = "/student/my-course";
      }, 1500);
    } catch (error: unknown) {
      toast.error("Không thể xác nhận thanh toán. Vui lòng thử lại!");
      setIsVerifyingQr(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* LEFT COLUMN: Payment Methods + Course Items + Trust Pillars */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* SECTION 1: Select Payment Method */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {t("checkout.paymentMethod")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Chọn kênh thanh toán thuận tiện nhất với bạn
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Bảo mật 100%
            </span>
          </div>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              const isDisabled = !method.isAvailable;

              return (
                <div
                  key={method.id}
                  onClick={() => {
                    if (!isDisabled) setPaymentMethod(method.id);
                  }}
                  className={cn(
                    "group relative flex items-start gap-4 rounded-xl border p-4 transition-all",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-muted/20 border-border/60"
                      : "cursor-pointer hover:border-primary/60 hover:bg-accent/40",
                    isSelected
                      ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20 shadow-sm"
                      : "border-border bg-card"
                  )}
                >
                  {/* Radio Indicator */}
                  <div className="pt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
                    )}
                  </div>

                  {/* Icon Badge */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
                      isSelected
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-muted/60 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Method Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">
                        {method.name}
                      </span>
                      {method.badge && (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            method.isAvailable
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border"
                          )}
                        >
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Course Items List */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("checkout.paymentInfo", { count: courseItems.length })}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Khóa học sẽ được kích hoạt ngay vào tài khoản của bạn
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {courseItems.length} khóa học
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {courseItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={item.course_img || item.img || "/logo/favicon.png"}
                      fill
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {item.teacher_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.teacher_name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                        <Laptop className="h-2.5 w-2.5" />
                        Trọn đời
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 sm:pl-4">
                  <span className="text-base font-bold text-foreground">
                    {t("common.vnd", {
                      amount: Number(item.price).toLocaleString(),
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Trust & Assurance Micro-Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="rounded-xl border border-border/80 bg-card p-4 flex items-start gap-3 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-foreground">Bảo mật chuẩn SSL</h5>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                Giao dịch được mã hóa an toàn qua cổng cấp phép NHNN.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 flex items-start gap-3 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-foreground">Kích hoạt tức thì</h5>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                Vào học ngay sau khi thanh toán, không cần chờ duyệt.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-4 flex items-start gap-3 shadow-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-foreground">Hoàn tiền 30 ngày</h5>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                Cam kết hoàn lại 100% học phí nếu không hài lòng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="font-bold text-base text-foreground">
              {t("checkout.orderSummary")}
            </h3>
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {courseItems.length} mục
            </span>
          </div>

          {/* Coupon Code Input */}
          <div className="py-4 border-b border-border/60">
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá..."
                    className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-xs uppercase placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="h-9 px-3 text-xs font-semibold rounded-xl"
                >
                  Áp dụng
                </Button>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Mã {appliedCoupon} (-{discountPercent}%)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span>Gợi ý mã:</span>
                  <button
                    type="button"
                    onClick={() => setCouponCode("WELCOME2026")}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    WELCOME2026 (-20%)
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Price Breakdown */}
          <div className="py-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("checkout.originalPrice")}</span>
              <span className="font-medium text-foreground">
                {t("common.vnd", { amount: rawTotalAmount.toLocaleString() })}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Giảm giá ưu đãi:</span>
                <span className="font-semibold">
                  -{t("common.vnd", { amount: discountAmount.toLocaleString() })}
                </span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Phí xử lý giao dịch:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Miễn phí
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-base text-foreground">Tổng thanh toán:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-primary tracking-tight">
                  {t("common.vnd", { amount: finalTotalAmount.toLocaleString() })}
                </span>
                <p className="text-[10px] text-muted-foreground">(Đã bao gồm thuế GTGT)</p>
              </div>
            </div>
          </div>

          {/* Terms & Notice */}
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
            {t("checkout.termsPrefix")}{" "}
            <Link href="#" className="font-semibold text-primary hover:underline">
              {t("checkout.terms")}
            </Link>{" "}
            và chính sách bảo mật của CourseDemy.
          </p>

          {/* Checkout CTA Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || courseItems.length === 0}
            className="w-full h-12 rounded-xl text-sm font-bold text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang chuyển đến cổng thanh toán...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t("checkout.pay", {
                  amount: t("common.vnd", { amount: finalTotalAmount.toLocaleString() }),
                })}
              </span>
            )}
          </Button>

          {/* Refund policy note */}
          <div className="mt-4 rounded-xl bg-muted/40 p-3 text-center border border-border/50">
            <h4 className="text-xs font-bold text-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              {t("checkout.refundTitle")}
            </h4>
            <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
              {t("checkout.refundDescription")}
            </p>
          </div>
        </div>

        {/* Support Pill */}
        <div className="rounded-xl border border-border/60 bg-card/60 p-3.5 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <span>Cần hỗ trợ thanh toán? Hotline: <strong>1900 6868</strong></span>
        </div>
      </div>

      {/* QR PAYMENT POPUP MODAL */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">Quét mã QR Thanh toán</h3>
              </div>
              <button
                type="button"
                onClick={() => setQrModalData(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="mx-auto w-56 h-56 rounded-xl border-2 border-primary/30 p-2 bg-white flex items-center justify-center shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrModalData.qrCode}
                  alt="Mã QR Thanh Toán"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  Số tiền: <strong className="text-primary text-sm">{qrModalData.amount.toLocaleString()} VND</strong>
                </p>
                <p className="font-mono text-[11px] bg-muted/60 py-1 px-2 rounded-md inline-block">
                  Mã GD: {qrModalData.transactionNo}
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Mẹo: Trong môi trường thử nghiệm, nhấn nút bên dưới để giả lập hoàn tất chuyển khoản.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQrModalData(null)}
                disabled={isVerifyingQr}
                className="flex-1 rounded-xl text-xs h-10"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleConfirmQrPayment}
                disabled={isVerifyingQr}
                className="flex-1 rounded-xl text-xs font-bold h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isVerifyingQr ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang xác nhận...
                  </span>
                ) : (
                  "Tôi đã chuyển khoản"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;

