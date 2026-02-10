import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config";
import { ApiResponse } from "@/features/auth/shared/types/authTypes";
import {
  BrowseCoursesRequest,
  BrowseCoursesResponse,
  CourseDetails,
  MyCoursesResponse,
  ApiCourseDetails,
  ApiTopic,
  Topic,
  ApiCourseTopicsResponse,
  CourseTopics,
  ApiContentDetails,
  ContentDetails,
  ApiContentBlock,
  ContentBlock,
} from "../types/courseTypes";

// Helper function to transform API topic status to component status
const transformTopicStatus = (
  apiStatus: ApiTopic["status"],
  isCompleted: boolean
): Topic["status"] => {
  if (isCompleted || apiStatus === "completed") return "completed";
  if (apiStatus === "locked") return "locked";
  return "in-progress"; // "unlocked" maps to "in-progress"
};

// Helper function to transform API topic to component topic
const transformTopic = (topic: ApiTopic): Topic => ({
  topic_id: topic.topic_id,
  title: topic.title,
  description: topic.description,
  status: transformTopicStatus(topic.status, topic.is_completed),
  materials:
    topic.contents?.map((content) => ({
      id: content.content_id,
      title: content.title,
      isCompleted: content.is_completed,
    })) || [],
});

// Helper function to transform API response to component-friendly format
const transformCourseDetails = (apiData: ApiCourseDetails): CourseDetails => {
  return {
    ...apiData,
    topics: apiData.topics?.map(transformTopic) || null,
  };
};

// Helper function to transform course topics response
const transformCourseTopics = (apiData: ApiCourseTopicsResponse): CourseTopics => {
  return {
    course_id: apiData.course_id,
    course_name: apiData.course_name,
    topics: apiData.topics?.map(transformTopic) || [],
  };
};

// Helper function to transform content block
const transformBlock = (block: ApiContentBlock): ContentBlock => ({
  blockId: block.block_id,
  type: block.type,
  sequence: block.sequence,
  // Text block
  textContent: block.text_content,
  // Media block
  mediaUrl: block.media_url,
  mediaType: block.media_type,
  caption: block.caption,
  // Quiz block - transform questions
  questions: block.questions?.map((q) => ({
    questionId: q.question_id,
    questionText: q.question_text,
    questionType: q.question_type,
    points: q.points,
    options:
      q.options?.map((opt, index) => ({
        optionId: opt.option_id,
        optionText: opt.option_text,
        isCorrect: opt.is_correct,
        sequence: index + 1,
      })) || [],
  })),
});

// Helper function to transform content details response
const transformContentDetails = (apiData: ApiContentDetails): ContentDetails => {
  return {
    contentId: apiData.content_id,
    title: apiData.title,
    type: apiData.type,
    sequence: apiData.sequence,
    topicId: apiData.topic_id,
    topicName: apiData.topic_name,
    isCompleted: apiData.is_completed,
    blocks: apiData.blocks?.map(transformBlock) || [],
    lastAttemptId: apiData.last_attempt_id,
  };
};

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
    const response = await api.post<ApiResponse<ApiCourseDetails>>(url, { enrollment_code });
    return transformCourseDetails(response.data.data);
  },

  async getCourseDetails(id: string): Promise<CourseDetails> {
    const url = API_ENDPOINTS.COURSES.DETAIL(id);
    const response = await api.get<ApiResponse<ApiCourseDetails>>(url);
    return transformCourseDetails(response.data.data);
  },

  async getCourseTopics(courseId: string): Promise<CourseTopics> {
    const url = API_ENDPOINTS.COURSES.Topic(courseId);
    const response = await api.get<ApiResponse<ApiCourseTopicsResponse>>(url);
    return transformCourseTopics(response.data.data);
  },

  async getContentDetails(contentId: string): Promise<ContentDetails> {
    const url = API_ENDPOINTS.COURSES.CONTENTDETAILS(contentId);
    const response = await api.get<ApiResponse<ApiContentDetails>>(url);
    const transformed = transformContentDetails(response.data.data);
    return transformed;
  },

  async markContentComplete(
    contentId: string
  ): Promise<{ contentId: string; isCompleted: boolean; completedAt: string }> {
    const url = API_ENDPOINTS.COURSES.CONTENT_COMPLETE(contentId);
    const response =
      await api.post<
        ApiResponse<{ content_id: string; is_completed: boolean; completed_at: string }>
      >(url);
    return {
      contentId: response.data.data.content_id,
      isCompleted: response.data.data.is_completed,
      completedAt: response.data.data.completed_at,
    };
  },

  async markContentIncomplete(
    contentId: string
  ): Promise<{ contentId: string; isCompleted: boolean; completedAt: string }> {
    const url = API_ENDPOINTS.COURSES.CONTENT_INCOMPLETE(contentId);
    const response =
      await api.post<
        ApiResponse<{ content_id: string; is_completed: boolean; completed_at: string }>
      >(url);
    return {
      contentId: response.data.data.content_id,
      isCompleted: response.data.data.is_completed,
      completedAt: response.data.data.completed_at,
    };
  },

  async unenrollCourse(courseId: string): Promise<void> {
    const url = `/student/courses/${courseId}/unenroll`;
    await api.delete<ApiResponse<null>>(url);
  },
};
