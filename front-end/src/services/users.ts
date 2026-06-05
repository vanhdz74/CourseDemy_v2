import publicClient from "@/api/publicClient";
import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/services/endpoints";
import type { UserProfile } from "@/types/userType";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  retype_password: string;
  role: string;
  is_active: number;
}

export async function register(payload: RegisterPayload) {
  await publicClient.post(endpoints.auth.register, payload);
}

export interface UserProfileForm extends UserProfile {
  role?: string;
  description?: string;
}

export async function getProfile(userId: number | string) {
  const { data } = await axiosClient.get<UserProfileForm>(
    endpoints.users.byId(Number(userId))
  );
  return data;
}

export async function updateProfile(
  userId: number | string,
  payload: UserProfileForm
) {
  const { data } = await axiosClient.put<{ message: string }>(
    endpoints.users.update(Number(userId)),
    payload
  );
  return data;
}

export async function uploadAvatar(userId: number | string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post<{ url: string }>(
    endpoints.users.uploadAvatar(Number(userId)),
    formData
  );
  return data.url;
}

export async function getAllUsers() {
  const { data } = await axiosClient.get(endpoints.users.all);
  return data;
}

export async function getUsersByCourse(courseId: number) {
  const { data } = await axiosClient.get(endpoints.users.byCourse(courseId));
  return data;
}
