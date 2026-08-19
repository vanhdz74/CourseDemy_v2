import { baseApi } from "@/redux/api/baseApi";
import { endpoints } from "@/services/endpoints";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<unknown[], void>({
      query: () => ({ url: endpoints.transactions.list }),
      providesTags: [{ type: "Transaction", id: "LIST" }],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionApi;
