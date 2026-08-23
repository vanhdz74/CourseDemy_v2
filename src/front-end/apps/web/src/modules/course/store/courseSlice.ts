import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  courseId: number | null;
  courseTitle: string;
}

const getStoredCourse = (): CourseState => {
  if (typeof window === "undefined") {
    return { courseId: null, courseTitle: "" };
  }
  try {
    const item = localStorage.getItem("course");
    if (item) {
      const parsed = JSON.parse(item);
      return {
        courseId: parsed.courseId ?? null,
        courseTitle: parsed.courseTitle ?? "",
      };
    }
  } catch {
    // ignore parse error
  }
  return { courseId: null, courseTitle: "" };
};

const initialState: CourseState = getStoredCourse();

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
      if (typeof window !== "undefined") {
        localStorage.setItem("course", JSON.stringify(action.payload));
      }
    },
    clearCourse: (state) => {
      state.courseId = null;
      state.courseTitle = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("course");
      }
    },
  },
});

export const { setCourse, clearCourse } = courseSlice.actions;
export default courseSlice.reducer;

