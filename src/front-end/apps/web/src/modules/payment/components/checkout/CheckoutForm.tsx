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

const CheckoutForm: React.FC<CheckoutFormProps> = ({ courseItems }) => {
  const { t } = useI18n();
  const { post } = useApi();
  const { data: session } = useSession();
  const user = session?.user;
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const totalAmount = Array.isArray(courseItems)
    ? courseItems.reduce((sum, item) => sum + Number(item.price), 0)
    : 0;

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error(t("checkout.selectPaymentMethod"));
      return;
    }

    try {
      const body = {
        courseIds: courseItems.map((item) => item.id),
        courseId: courseItems.map((item) => item.id),
        userId: user?.id,
        paymentMethod,
        totalPrice: totalAmount,
      };

      const payment = await post<PaymentResponse>(
        `/api/payment/create?provider=${paymentMethod}`,
        body
      );

      if (!payment.paymentUrl) {
        toast.error(t("checkout.missingPaymentUrl"));
        return;
      }

      toast.success(t("checkout.redirecting"));
      window.location.assign(payment.paymentUrl);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const msg =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        t("checkout.genericError");
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">{t("checkout.title")}</h2>

      <div className="md:flex md:gap-8">
        {/* Left: Payment Options */}
        <div className="md:flex-1 mb-6 md:mb-0">
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t("checkout.paymentMethod")}</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                VNPay
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                  disabled
                />
                MoMo
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="credit-card"
                  checked={paymentMethod === "credit-card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                  disabled
                />
                Credit Card
              </label>
            </div>
          </div>

          <div className="mt-10">
            <h3>{t("checkout.paymentInfo", { count: courseItems.length })}</h3>
            <hr />
            <div>
              {courseItems.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between mb-5">
                    <div className="flex">
                      <div>
                        <Image
                          src={item.course_img}
                          width={100}
                          height={100}
                          alt={item.title}
                          className="w-25 h-15 mr-5 object-cover"
                        />
                      </div>
                      <div>{item.title}</div>
                    </div>
                    <div>
                      {t("common.vnd", {
                        amount: Number(item.price).toLocaleString(),
                      })}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-76 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-4">{t("checkout.orderSummary")}</h3>
          <hr />
          <div className="flex justify-between mb-10">
            <span>{t("checkout.originalPrice")} </span>
            <span>
              {t("common.vnd", { amount: totalAmount.toLocaleString() })}
            </span>
          </div>

          <div className="text-sm text-[#848383] mx-auto mb-3">
            {t("checkout.termsPrefix")}{" "}
            <Link href={"#"} className="text-blue-600">
              {t("checkout.terms")}
            </Link>
            .
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-sm transition"
          >
            {t("checkout.pay", {
              amount: t("common.vnd", { amount: totalAmount.toLocaleString() }),
            })}
          </Button>

          <div className="text-center mt-10">
            <h3 className="text-md">{t("checkout.refundTitle")}</h3>
            <span className="text-sm">
              {t("checkout.refundDescription")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
