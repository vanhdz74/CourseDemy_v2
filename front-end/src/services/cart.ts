import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/services/endpoints";
import { Course } from "@/types/courseType";

export interface CartItem {
  id?: number;
  course_id: number;
  price?: number;
}

export interface CartResponse {
  id: number;
  cart_items: CartItem[];
}

export interface DetailedCartItem extends CartItem, Partial<Course> {}

export async function getCart(userId: number) {
  const { data } = await axiosClient.get<CartResponse>(endpoints.cart.byUser(userId));
  return data;
}

export async function getCartCourseIds(userId: number) {
  const cart = await getCart(userId);
  return Array.isArray(cart?.cart_items)
    ? cart.cart_items.map((item) => item.course_id)
    : [];
}

export async function addToCart(userId: number, courseId: number) {
  const { data } = await axiosClient.post<{ message: string }>(
    endpoints.cart.add(userId, courseId)
  );
  return data;
}

export async function removeFromCart(userId: number, courseId: number) {
  const { data } = await axiosClient.delete<{ message: string }>(
    endpoints.cart.remove(userId, courseId)
  );
  return data;
}

export async function getDetailedCart(userId: number) {
  const cart = await getCart(userId);
  const items = Array.isArray(cart?.cart_items) ? cart.cart_items : [];

  return Promise.all(
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
}
