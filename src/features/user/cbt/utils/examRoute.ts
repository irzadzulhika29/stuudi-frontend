interface ExamRouteOptions {
  examCode?: string | null;
  examId?: string | null;
}

type ExamLookup =
  | {
      type: "examId";
      value: string;
    }
  | {
      type: "code";
      value: string;
    };

export function buildExamRoute({ examCode, examId }: ExamRouteOptions): string {
  if (examId) {
    return `/cbt/exam?examId=${encodeURIComponent(examId)}`;
  }

  if (examCode) {
    return `/cbt/exam?code=${encodeURIComponent(examCode)}`;
  }

  return "/cbt/exam";
}

export function resolveExamLookup({ examCode, examId }: ExamRouteOptions): ExamLookup | null {
  if (examId) {
    return { type: "examId", value: examId };
  }

  if (examCode) {
    return { type: "code", value: examCode };
  }

  return null;
}

interface CanReuseLoadedExamOptions {
  requestedExamId?: string | null;
  loadedExamId?: string | null;
  isInitialized: boolean;
  questionCount: number;
}

export function canReuseLoadedExam({
  requestedExamId,
  loadedExamId,
  isInitialized,
  questionCount,
}: CanReuseLoadedExamOptions): boolean {
  if (!isInitialized || questionCount === 0) {
    return false;
  }

  if (!requestedExamId) {
    return false;
  }

  return loadedExamId === requestedExamId;
}
