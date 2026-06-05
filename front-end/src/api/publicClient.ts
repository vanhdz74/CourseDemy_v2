// src/api/publicClient.ts
import axios from "axios";
import { normalizeErrorResponse, normalizeSuccessResponse } from "@/api/response";

const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

publicClient.interceptors.response.use(
  normalizeSuccessResponse,
  normalizeErrorResponse
);

export default publicClient;

// API public
// const res1 = await publicClient.get("/course/{id}");
