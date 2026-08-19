import { baseApi } from "@/redux/api/baseApi";

export type CreatePaymentRequest = {
  provider: string;
  courseIds: number[];
  courseId?: number[];
  userId?: string | number;
  paymentMethod: string;
  totalPrice: number;
};

export type CreatePaymentResponse = {
  code?: string;
  message?: string;
  paymentUrl: string;
};

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
      query: ({ provider, ...payload }) => ({
        url: "/api/payment/create",
        method: "POST",
        params: { provider },
        data: payload,
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
