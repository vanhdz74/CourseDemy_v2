import { baseApi, type ApiMessageResponse } from "@/redux/api/baseApi";
import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/services/endpoints";
import type {
  CartCourseMutationRequest,
  CartResponse,
  DetailedCartItem,
  GetCartCourseIdsResponse,
  GetCartRequest,
} from "@/services/cart";
import type { Course } from "@/types/courseType";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, GetCartRequest>({
      query: ({ userId }) => ({ url: endpoints.cart.byUser(userId) }),
      providesTags: (_result, _error, { userId }) => [{ type: "Cart", id: userId }],
    }),
    getCartCourseIds: builder.query<GetCartCourseIdsResponse, GetCartRequest>({
      query: ({ userId }) => ({ url: endpoints.cart.byUser(userId) }),
      transformResponse: (response: CartResponse) => ({
        courseIds: Array.isArray(response?.cart_items)
          ? response.cart_items.map((item) => item.course_id)
          : [],
      }),
      providesTags: (_result, _error, { userId }) => [{ type: "Cart", id: userId }],
    }),
    getDetailedCart: builder.query<DetailedCartItem[], GetCartRequest>({
      async queryFn({ userId }) {
        try {
          const { data: cart } = await axiosClient.get<CartResponse>(
            endpoints.cart.byUser(userId)
          );
          const items = Array.isArray(cart?.cart_items) ? cart.cart_items : [];
          const detailedItems = await Promise.all(
            items.map(async (item) => {
              try {
                const { data: course } = await axiosClient.get<Course>(
                  endpoints.courses.byId(item.course_id)
                );
                return { ...item, ...course };
              } catch {
                return { ...item, title: `Khóa học #${item.course_id}` };
              }
            })
          );

          return { data: detailedItems };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Không tải được giỏ hàng";
          return { error: { message } };
        }
      },
      providesTags: (_result, _error, { userId }) => [{ type: "Cart", id: userId }],
    }),
    addToCart: builder.mutation<ApiMessageResponse, CartCourseMutationRequest>({
      query: ({ userId, courseId }) => ({
        url: endpoints.cart.add(userId, courseId),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "Cart", id: userId }],
    }),
    removeFromCart: builder.mutation<ApiMessageResponse, CartCourseMutationRequest>({
      query: ({ userId, courseId }) => ({
        url: endpoints.cart.remove(userId, courseId),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: "Cart", id: userId }],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartCourseIdsQuery,
  useGetCartQuery,
  useGetDetailedCartQuery,
  useRemoveFromCartMutation,
} = cartApi;
