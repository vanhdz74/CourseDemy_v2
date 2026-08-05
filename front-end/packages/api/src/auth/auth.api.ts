import type { RegisterPayload } from "@repo/contracts";
import { publicClient } from "../client/http-client";
import { endpoints } from "../endpoints";

export async function register(payload: RegisterPayload) {
  await publicClient.post(endpoints.auth.register, payload);
}
