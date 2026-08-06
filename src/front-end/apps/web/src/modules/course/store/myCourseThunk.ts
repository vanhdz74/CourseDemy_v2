import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCoursesByUser } from "@repo/api";

export const fetchRegisteredCourses = createAsyncThunk(
  "myCourse/fetch",
  async ({ userId }: { userId: number; token: string }) =>
    getCoursesByUser(userId)
);
