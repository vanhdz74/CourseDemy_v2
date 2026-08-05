export * as authApi from "./auth/auth.api";
export * as cartApi from "./cart/cart.api";
export * as courseApi from "./courses/courses.api";
export * as paymentApi from "./payments/payments.api";
export * as settingsApi from "./settings/settings.api";
export * as userApi from "./users/users.api";
export { configureApiClient, axiosClient, publicClient } from "./client/http-client";
export { endpoints } from "./endpoints";
export { queryKeys } from "./query-keys";
export * from "./client/error-handler";
export * from "./auth/auth.api";
export * from "./cart/cart.api";
export * from "./courses/courses.api";
export * from "./payments/payments.api";
export * from "./settings/settings.api";
export * from "./users/users.api";

import * as authApi from "./auth/auth.api";
import * as cartApi from "./cart/cart.api";
import * as courseApi from "./courses/courses.api";
import * as paymentApi from "./payments/payments.api";
import * as settingsApi from "./settings/settings.api";
import * as userApi from "./users/users.api";
import { endpoints } from "./endpoints";

export const api = {
  auth: authApi,
  cart: cartApi,
  courses: courseApi,
  endpoints,
  settings: settingsApi,
  transactions: paymentApi,
  users: userApi,
};

export type Api = typeof api;
