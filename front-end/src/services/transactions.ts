import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/services/endpoints";

export async function getTransactions() {
  const { data } = await axiosClient.get(endpoints.transactions.list);
  return data;
}
