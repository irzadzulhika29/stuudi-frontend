export const APP_NAME = "Arteri";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  PRODUK: "/produk",
  TENTANG_KAMI: "/tentang-kami",
  FAQ: "/faq",
  BANTUAN: "/bantuan",

  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  TEAM: "/team",

  ADMIN_DASHBOARD: "/dashboard-admin",
  ADMIN_COURSES: "/dashboard-admin/courses",
  ADMIN_TEAM: "/dashboard-admin/participants",
  ADMIN_DISQUALIFIEDTEAM: "/dashboard-admin/disqualified-participants",
  ADMIN_CHEATING: "/dashboard-admin/cheating-report",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login-elearning",

    ME: "/auth/me",
  },
  COURSES: {
    ALL: (page: number, per_page: number, search: string) =>
      `/courses/browse?page=${page}&per_page=${per_page}&search=${search}`,
    MY: "student/courses",
    ENROLL: "student/enroll",
    LIST: "/courses",
    DETAIL: (id: string) => `student/courses/${id}`,
    Topic: (id: string) => `student/courses/${id}/topics`,
    CONTENTDETAILS: (id: string) => `student/content/${id}`,
    CONTENT_COMPLETE: (id: string) => `student/content/${id}/complete`,
    CONTENT_INCOMPLETE: (id: string) => `student/content/${id}/incomplete`,
    QUIZ: {
      START: (contentId: string) => `student/content/${contentId}/quiz/start`,
      ANSWER: (attemptId: string) => `student/exams-attempt/${attemptId}/answers`,
      SUBMIT: (attemptId: string) => `student/quiz-attempts/${attemptId}/submit`,
      RESULT: (attemptId: string) => `student/quiz-attempts/${attemptId}/result`,
    },
    TOPIC_NOTES: (topicId: string) => `student/topics/${topicId}/notes`,
    NOTE_UPDATE: (noteId: string) => `student/notes/${noteId}`,
    NOTE_DELETE: (noteId: string) => `student/notes/${noteId}`,
  },
  TEACHER: {
    COURSES: "teacher/courses",
    ADD_COURSE: "teacher/add-course",
    UPDATE_COURSE: (id: string) => `teacher/courses/${id}`,
    DELETE_COURSE: (id: string) => `teacher/courses/${id}`,
    COURSE_DETAIL: (id: string) => `student/courses/${id}`,
    ADD_TOPIC: (courseId: string) => `teacher/courses/${courseId}/topics`,
    // Content (Material/Quiz)
    ADD_CONTENT: (topicId: string) => `teacher/topics/${topicId}/content`,
    CONTENT_DETAIL: (contentId: string) => `teacher/content/${contentId}`,
    // Quiz
    ADD_QUIZ_CONTENT: (topicId: string) => `teacher/topics/${topicId}/content`,
    ADD_QUIZ_QUESTIONS: (contentId: string) => `teacher/content/${contentId}/quiz`,
    GET_QUIZ_DETAILS: (contentId: string) => `teacher/content/${contentId}/quiz/details`,
    // Blocks
    ADD_TEXT_BLOCK: (contentId: string) => `teacher/content/${contentId}/blocks/text`,
    ADD_MEDIA_BLOCK: (contentId: string) => `teacher/content/${contentId}/blocks/media`,
    ADD_QUIZ_BLOCK: (contentId: string) => `teacher/content/${contentId}/blocks/quiz`,
    DELETE_BLOCK: (blockId: string) => `teacher/blocks/${blockId}`,
    ADD_QUIZ_QUESTION: (blockId: string) => `teacher/blocks/${blockId}/questions`,
    UPDATE_QUESTION: (questionId: string) => `teacher/questions/${questionId}`,
    DELETE_QUESTION: (questionId: string) => `teacher/questions/${questionId}`,
  },
  TEAM: {
    INFO: "/elearning/team-details",
    LIST: "/teams",
  },
  EXAM: {
    UPCOMING: "upcoming-exam",
    ACCESS: "student/exams/access",
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
} as const;
