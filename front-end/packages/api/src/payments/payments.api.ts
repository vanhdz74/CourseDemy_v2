import { axiosClient } from "../client/http-client";
import { endpoints } from "../endpoints";

export async function getTransactions() {
  const { data } = await axiosClient.get(endpoints.transactions.list);
  return data;
}
