import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  courseId: number | null;
  courseTitle: string | "";
}

const initialState: CourseState = {
  courseId: null,
  courseTitle: "",
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (
      state,
      action: PayloadAction<{ courseId: number; courseTitle: string }>
    ) => {
      state.courseId = action.payload.courseId;
      state.courseTitle = action.payload.courseTitle;
      // Lưu vào localStorage
      localStorage.setItem("course", JSON.stringify(action.payload));
    },
    clearCourse: (state) => {
      state.courseId = null;
      state.courseTitle = "";
      localStorage.removeItem("course");
    },
  },
});

export const { setCourse, clearCourse } = courseSlice.actions;
export default courseSlice.reducer;
