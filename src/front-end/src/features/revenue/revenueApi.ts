import { baseApi } from "@/redux/api/baseApi";

export type RevenueByDaysRequest = {
  fromDate?: string;
  toDate?: string;
};

export type RevenueByMonthItem = {
  month: string;
  revenue: number;
};

export type RevenueByCategoryItem = {
  category: string;
  revenue: number;
};

export type DailyRevenueItem = {
  day: string;
  revenue: number;
};

export const revenueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRevenueByMonth: builder.query<
      RevenueByMonthItem[],
      { courseId?: number | null } | void
    >({
      query: (request) => ({
        url: "/revenue-by-month",
        params: request?.courseId ? { courseId: request.courseId } : undefined,
      }),
      providesTags: [{ type: "Revenue", id: "MONTH" }],
    }),
    getRevenueByDays: builder.query<DailyRevenueItem[], RevenueByDaysRequest | void>({
      query: (request = {}) => ({
        url: "/revenue-by-days",
        params: request,
      }),
      providesTags: [{ type: "Revenue", id: "DAYS" }],
    }),
    getRevenueByCategory: builder.query<RevenueByCategoryItem[], void>({
      query: () => ({ url: "/revenue-categories" }),
      providesTags: [{ type: "Revenue", id: "CATEGORY" }],
    }),
  }),
});

export const {
  useGetRevenueByCategoryQuery,
  useGetRevenueByDaysQuery,
  useGetRevenueByMonthQuery,
} = revenueApi;
