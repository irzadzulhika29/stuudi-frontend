import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import {
  BrowseCoursesRequest,
  BrowseCoursesResponse,
  CourseDetails,
  MyCoursesResponse,
} from "../types/courseTypes";

export const courseService = {
  async browseCourses(params: BrowseCoursesRequest): Promise<BrowseCoursesResponse> {
    const url = API_ENDPOINTS.COURSES.ALL(params.page, params.per_page, params.search);

    const response = await api.get<ApiResponse<BrowseCoursesResponse>>(url);
    return response.data.data;
  },

  async getMyCourses(): Promise<MyCoursesResponse> {
    const url = API_ENDPOINTS.COURSES.MY;
    const response = await api.get<ApiResponse<MyCoursesResponse>>(url);
    return response.data.data;
  },

  async enrollCourse(enrollment_code: string): Promise<CourseDetails> {
    const url = API_ENDPOINTS.COURSES.ENROLL;
    const response = await api.post<ApiResponse<CourseDetails>>(url, { enrollment_code });
    return response.data.data;
  },

  async getCourseDetails(id: string): Promise<CourseDetails> {
    const url = API_ENDPOINTS.COURSES.DETAIL(id);
    const response = await api.get<ApiResponse<CourseDetails>>(url);
    return response.data.data;
  },
};
