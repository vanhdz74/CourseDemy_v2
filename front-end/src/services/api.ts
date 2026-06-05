import * as cart from "@/services/cart";
import * as courses from "@/services/courses";
import { endpoints } from "@/services/endpoints";
import * as settings from "@/services/settings";
import * as transactions from "@/services/transactions";
import * as users from "@/services/users";

export const api = {
  cart,
  courses,
  endpoints,
  settings,
  transactions,
  users,
};

export type Api = typeof api;
