import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRegisteredCourses = createAsyncThunk(
  "myCourse/fetch",
  async ({ userId, token }: { userId: number; token: string }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch registered courses");
    const data = await res.json(); // trả về danh sách khoá học
    // console.log(data);
    return data;
  }
);
