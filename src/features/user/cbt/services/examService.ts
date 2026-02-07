import { api } from "@/shared/api/api";
import { ExamResumeResponse } from "@/features/user/dashboard/types/dashboardTypes";
import { ExamData, ExamQuestion, QuestionOption } from "../types/examTypes";
import { ApiResponse } from "../../../auth/shared/types/authTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";

export const examService = {
  async saveAnswer(
    attemptId: string,
    questionId: string,
    answer: QuestionAnswer
  ): Promise<boolean> {
    try {
      // Normalize answer to string[]
      let selectedOptionIds: string[] = [];

      if (typeof answer === "string") {
        selectedOptionIds = [answer];
      } else if (Array.isArray(answer)) {
        selectedOptionIds = answer as string[];
      } else if (answer && typeof answer === "object") {
        // For matching (Record<string, string>), we send the selected option IDs (values)
        // Adjust this if your backend expects a specific format like "key:value"
        selectedOptionIds = Object.values(answer as Record<string, string>);
      }

      await api.post(`/student/exams-attempt/${attemptId}/answers`, {
        question_id: questionId,
        selected_option_id: selectedOptionIds,
      });
      return true;
    } catch (error) {
      console.error("Failed to save answer", error);
      return false;
    }
  },

  async clearAnswer(attemptId: string, questionId: string): Promise<boolean> {
    try {
      await api.delete(`/student/exams-attempt/${attemptId}/questions/${questionId}`);
      return true;
    } catch (error) {
      console.error("Failed to clear answer", error);
      return false;
    }
  },

  transformExamToReduxPayload(response: ExamResumeResponse) {
    // Map response to ExamData
    const examData: ExamData = {
      exam_id: response.exam_id,
      title: response.title,
      duration: response.duration,
      questions: response.questions.map((q) => ({
        question_id: q.question_id,
        question_text: q.question_text,
        question_type: q.question_type as ExamQuestion["question_type"],
        points: q.points,
        options: q.options as QuestionOption[],
      })),
      attempt_id: response.attempt_id,
    };

    // Extract saved answers
    const initialAnswers: Record<string, QuestionAnswer> = {};
    response.questions.forEach((q) => {
      if (q.saved_answer) {
        initialAnswers[q.question_id] = q.saved_answer;
      }
    });

    // Load saved flags from LocalStorage
    let initialFlags: string[] = [];
    try {
      const savedFlags = localStorage.getItem(`exam_flags_${response.exam_id}`);
      if (savedFlags) {
        initialFlags = JSON.parse(savedFlags);
      }
    } catch (e) {
      console.error("Failed to load flags", e);
    }

    return {
      examData,
      maxLives: 3,
      lives: response.lives_info?.lives_remaining ?? 3,
      timeRemaining: response.time_remaining,
      initialAnswers,
      initialFlags,
    };
  },

  async recordTabSwitch(attemptId: string): Promise<{
    lives_remaining: number;
    warning_message: string;
    is_disqualified: boolean;
  } | null> {
    try {
      const response = await api.post(`/student/exams-attempt/${attemptId}/tab-switch`, {
        timestamp: new Date().toISOString(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to record tab switch", error);
      return null;
    }
  },

  async submitExam(attemptId: string): Promise<ApiResponse<unknown>> {
    try {
      const response = await api.post<ApiResponse<unknown>>(
        `/student/exams-attempt/${attemptId}/submit`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to submit exam", error);
      throw error;
    }
  },
};
