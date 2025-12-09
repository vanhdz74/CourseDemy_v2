import { createSlice } from "@reduxjs/toolkit";
import { fetchRegisteredCourses } from "./myCourseThunk";
import { Course } from "@/types/courseType";

const registeredCoursesSlice = createSlice({
  name: "registeredCourses",
  initialState: {
    courses: [] as Course[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchRegisteredCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export default registeredCoursesSlice.reducer;
