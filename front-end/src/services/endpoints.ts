export const endpoints = {
  auth: {
    refreshToken: "/refresh-token",
    register: "/register",
    resetPassword: "/reset-password",
    sendOtp: "/send-otp",
    verifyOtp: "/verify-otp",
  },
  cart: {
    add: (userId: number, courseId: number) =>
      `/cart/add?userId=${userId}&courseId=${courseId}`,
    byUser: (userId: number) => `/cart/user/${userId}`,
    remove: (userId: number, courseId: number) =>
      `/cart/remove?userId=${userId}&courseId=${courseId}`,
  },
  categories: {
    base: "/category",
    byId: (categoryId: number) => `/category/${categoryId}`,
    list: "/categories",
  },
  comments: {
    base: "/comment",
    byId: (commentId: number) => `/comment/${commentId}`,
    bySubLesson: (subLessonId: number) => `/comments/sublesson/${subLessonId}`,
  },
  courses: {
    base: "/course",
    byId: (courseId: number) => `/course/${courseId}`,
    byUser: (userId: number) => `/courses/user/${userId}`,
    detail: (courseId: number) => `/course-detail/${courseId}`,
    detailManage: (courseId: number) => `/course-detail/m1/${courseId}`,
    search: "/courses/search",
    students: (courseId: number) => `/courses/${courseId}/students`,
    uploadImage: (courseId: number) => `/upload-course-img/${courseId}`,
  },
  lessons: {
    byCourse: (courseId: number) => `/lessons/course/${courseId}`,
    byId: (lessonId: number) => `/lesson/${lessonId}`,
    createByCourse: (courseId: number) => `/lesson/course/${courseId}`,
    publicByCourse: (courseId: number) => `/public/lessons/course/${courseId}`,
    reorder: "/lesson/reorder",
  },
  payment: {
    checkout: "/checkout",
    momoPayment: "/payment/momo/create-payment",
  },
  revenue: {
    byCategory: "/revenue/by-category",
    byDay: "/revenue/by-day",
    byMonth: "/revenue/by-month",
    overview: "/revenue/overview",
    topCourses: "/revenue/top-courses",
  },
  reviews: {
    byCourse: (courseId: number) => `/reviews/course/${courseId}`,
    createByCourse: (courseId: number) => `/review/course/${courseId}`,
  },
  subLessons: {
    byId: (subLessonId: number) => `/sublesson/${subLessonId}`,
    byLesson: (lessonId: number) => `/sublessons/lesson/${lessonId}`,
    createByLesson: (lessonId: number) => `/sublesson/lesson/${lessonId}`,
    publicByLesson: (lessonId: number) => `/public/sublessons/lesson/${lessonId}`,
    update: (subLessonId: number) => `/sublesson/update/${subLessonId}`,
    uploadVideo: (subLessonId: number) => `/upload-video/${subLessonId}`,
  },
  transactions: {
    list: "/transaction",
  },
  users: {
    all: "/user/all",
    base: "/user",
    byCourse: (courseId: number) => `/users/course/${courseId}`,
    byId: (userId: number) => `/user/${userId}`,
    update: (userId: number) => `/user/update/${userId}`,
    uploadAvatar: (userId: number) => `/user/upload-avatar/${userId}`,
  },
};
