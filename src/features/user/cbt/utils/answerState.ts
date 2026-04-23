import { QuestionAnswer } from "@/shared/types/questionTypes";

export function hasMeaningfulAnswer(answer: QuestionAnswer | undefined): boolean {
  if (answer === null || answer === undefined) {
    return false;
  }

  if (typeof answer === "string") {
    return answer.trim().length > 0;
  }

  if (Array.isArray(answer)) {
    return answer.length > 0;
  }

  if (typeof answer === "object") {
    return Object.values(answer).some((value) => hasMeaningfulAnswer(value));
  }

  return true;
}

export function countAnsweredQuestions(answers: Record<string, QuestionAnswer>): number {
  return Object.values(answers).filter((answer) => hasMeaningfulAnswer(answer)).length;
}
