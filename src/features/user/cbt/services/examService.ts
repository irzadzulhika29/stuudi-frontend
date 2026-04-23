import { api } from "@/shared/api/api";
import {
  ExamResumeResponse,
  ExamStartResponse,
} from "@/features/user/dashboard/types/dashboardTypes";
import { ExamData, ExamQuestion, QuestionOption } from "../types/examTypes";
import { ApiResponse } from "../../../auth/shared/types/authTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";

const ATTEMPT_QUESTION_SNAPSHOT_PREFIX = "exam_question_snapshot_";

function normalizeOptionSide(rawSide: unknown): "left" | "right" | undefined {
  if (typeof rawSide !== "string") {
    return undefined;
  }

  const normalized = rawSide.trim().toLowerCase();
  if (normalized === "left" || normalized === "right") {
    return normalized;
  }

  return undefined;
}

function normalizeQuestionOptions<
  TQuestion extends {
    question_type: string;
    options?: QuestionOption[];
  },
>(question: TQuestion): QuestionOption[] {
  const options = (question.options ?? []).map((option) => ({
    ...option,
    side: normalizeOptionSide(option.side),
  }));

  if (question.question_type !== "matching") {
    return options as QuestionOption[];
  }

  const inferredOptions = [...options];
  const groupedByPair = new Map<string, typeof inferredOptions>();

  for (const option of inferredOptions) {
    if (!option.matching_pair) continue;

    const group = groupedByPair.get(option.matching_pair) ?? [];
    group.push(option);
    groupedByPair.set(option.matching_pair, group);
  }

  groupedByPair.forEach((group) => {
    const hasBothSides =
      group.some((option) => option.side === "left") &&
      group.some((option) => option.side === "right");

    if (hasBothSides) {
      return;
    }

    const sortedGroup = [...group].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    sortedGroup.forEach((option, index) => {
      option.side = index % 2 === 0 ? "left" : "right";
    });
  });

  return inferredOptions as QuestionOption[];
}

function getAttemptSnapshotStorageKey(attemptId: string) {
  return `${ATTEMPT_QUESTION_SNAPSHOT_PREFIX}${attemptId}`;
}

function readAttemptQuestionSnapshot(
  attemptId: string
): Record<string, ExamStartResponse["questions"][number]> {
  try {
    const stored = localStorage.getItem(getAttemptSnapshotStorageKey(attemptId));
    if (!stored) {
      return {};
    }

    return JSON.parse(stored) as Record<string, ExamStartResponse["questions"][number]>;
  } catch (error) {
    console.error("Failed to read attempt question snapshot", error);
    return {};
  }
}

function shouldRestoreOptionsFromSnapshot(
  question: ExamResumeResponse["questions"][number],
  normalizedOptions: QuestionOption[]
) {
  if (normalizedOptions.length === 0) {
    return true;
  }

  if (question.question_type !== "matching") {
    return false;
  }

  const hasLeft = normalizedOptions.some((option) => option.side === "left");
  const hasRight = normalizedOptions.some((option) => option.side === "right");

  return !hasLeft || !hasRight;
}

function normalizeSavedAnswer(
  question: ExamResumeResponse["questions"][number],
  normalizedOptions: QuestionOption[]
): QuestionAnswer | undefined {
  const savedAnswer = question.saved_answer;

  if (!savedAnswer) {
    return undefined;
  }

  if (question.question_type === "single" || question.question_type === "true_false") {
    if (Array.isArray(savedAnswer)) {
      return savedAnswer[0] ?? null;
    }

    return typeof savedAnswer === "string" ? savedAnswer : null;
  }

  if (question.question_type === "matching" && Array.isArray(savedAnswer)) {
    const selectedIds = new Set(savedAnswer);
    const pairOptions = new Map<
      string,
      {
        left?: string;
        right?: string;
        leftSelected: boolean;
        rightSelected: boolean;
      }
    >();

    for (const option of normalizedOptions) {
      if (!option.matching_pair || !option.side) continue;

      const current = pairOptions.get(option.matching_pair) || {
        leftSelected: false,
        rightSelected: false,
      };

      if (option.side === "left") {
        current.left = option.option_id;
        current.leftSelected = selectedIds.has(option.option_id);
      } else {
        current.right = option.option_id;
        current.rightSelected = selectedIds.has(option.option_id);
      }

      pairOptions.set(option.matching_pair, current);
    }

    const matchingAnswer: Record<string, string> = {};
    pairOptions.forEach((pair) => {
      if (!pair.left || !pair.right) return;

      if (pair.leftSelected || pair.rightSelected) {
        matchingAnswer[pair.left] = pair.right;
      }
    });

    return Object.keys(matchingAnswer).length > 0 ? matchingAnswer : null;
  }

  return savedAnswer;
}

export const examService = {
  cacheAttemptQuestionSnapshot(response: ExamStartResponse) {
    try {
      const snapshot = Object.fromEntries(
        response.questions.map((question) => [question.question_id, question])
      );

      localStorage.setItem(
        getAttemptSnapshotStorageKey(response.attempt_id),
        JSON.stringify(snapshot)
      );
    } catch (error) {
      console.error("Failed to cache start exam question snapshot", error);
    }
  },

  clearAttemptQuestionSnapshot(attemptId: string) {
    try {
      localStorage.removeItem(getAttemptSnapshotStorageKey(attemptId));
    } catch (error) {
      console.error("Failed to clear attempt question snapshot", error);
    }
  },

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
        selectedOptionIds = Object.entries(answer as Record<string, string>).flatMap(
          ([leftId, rightId]) => [leftId, rightId]
        );
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

  transformStartExamToReduxPayload(response: ExamStartResponse) {
    const examData: ExamData = {
      exam_id: response.exam_id,
      title: response.title,
      duration: response.duration,
      questions: response.questions.map((q) => {
        const options = normalizeQuestionOptions(q);

        return {
          question_id: q.question_id,
          question_text: q.question_text,
          question_type: q.question_type as ExamQuestion["question_type"],
          points: q.points,
          question_image: q.image_url || q.question_image || undefined,
          options,
        };
      }),
      attempt_id: response.attempt_id,
    };

    return {
      examData,
      maxLives: 3,
      lives: response.lives_info?.lives_remaining ?? 3,
      timeRemaining: response.duration * 60,
      initialAnswers: {},
      initialFlags: [],
    };
  },

  transformExamToReduxPayload(response: ExamResumeResponse) {
    const questionSnapshot = readAttemptQuestionSnapshot(response.attempt_id);

    // Map response to ExamData
    const examData: ExamData = {
      exam_id: response.exam_id,
      title: response.title,
      duration: response.duration,
      questions: response.questions.map((q) => {
        const normalizedOptions = normalizeQuestionOptions(q);
        const snapshotQuestion = questionSnapshot[q.question_id];
        const shouldRestoreFromSnapshot =
          !!snapshotQuestion && shouldRestoreOptionsFromSnapshot(q, normalizedOptions);
        const options = shouldRestoreFromSnapshot
          ? normalizeQuestionOptions(snapshotQuestion)
          : normalizedOptions;

        return {
          question_id: q.question_id,
          question_text: q.question_text,
          question_type: q.question_type as ExamQuestion["question_type"],
          points: q.points,
          question_image: q.image_url || q.question_image || undefined,
          options,
        };
      }),
      attempt_id: response.attempt_id,
    };

    // Extract saved answers
    const initialAnswers: Record<string, QuestionAnswer> = {};
    response.questions.forEach((q) => {
      const normalizedOptions = examData.questions.find(
        (question) => question.question_id === q.question_id
      )?.options;
      const normalizedAnswer = normalizeSavedAnswer(q, normalizedOptions ?? []);
      if (normalizedAnswer !== undefined) {
        initialAnswers[q.question_id] = normalizedAnswer;
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
      const endpoint = `/student/exams-attempt/${attemptId}/submit`;

      const response = await api.post<ApiResponse<unknown>>(endpoint);

      return response.data;
    } catch (error) {
      console.error("Failed to submit exam", error);
      throw error;
    }
  },
};
