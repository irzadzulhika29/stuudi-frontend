import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExamState, ExamData } from "@/features/user/cbt/types/examTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";

const initialState: ExamState = {
  view: "intro",
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: [],
  lives: 3,
  maxLives: 3,
  timeRemaining: 0,
  isFinished: false,
  isInitialized: false,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    initializeExam: (
      state,
      action: PayloadAction<{
        examData: ExamData;
        maxLives?: number;
        timeRemaining?: number;
        lives?: number;
        initialAnswers?: Record<string, QuestionAnswer>;
        initialFlags?: string[];
      }>
    ) => {
      state.view = "exam";
      state.currentQuestionIndex = 0;
      state.answers = action.payload.initialAnswers || {};
      state.flaggedQuestions = action.payload.initialFlags || [];
      state.lives = action.payload.lives ?? action.payload.maxLives ?? 3;
      // Use provided timeRemaining, otherwise calculate from duration
      state.timeRemaining =
        action.payload.timeRemaining !== undefined
          ? action.payload.timeRemaining
          : action.payload.examData.duration * 60;
      state.examData = action.payload.examData;
      state.isInitialized = true;
    },

    setView: (state, action: PayloadAction<ExamState["view"]>) => {
      state.view = action.payload;
    },

    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },

    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: QuestionAnswer }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },

    toggleFlag: (state, action: PayloadAction<string>) => {
      const questionId = action.payload;
      const index = state.flaggedQuestions.indexOf(questionId);
      if (index === -1) {
        state.flaggedQuestions.push(questionId);
      } else {
        state.flaggedQuestions.splice(index, 1);
      }
    },

    setFlaggedQuestions: (state, action: PayloadAction<string[]>) => {
      state.flaggedQuestions = action.payload;
    },

    decrementLife: (state) => {
      if (state.lives > 0) {
        state.lives -= 1;
      }
    },

    setLives: (state, action: PayloadAction<number>) => {
      state.lives = action.payload;
    },

    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },

    finishExam: (state) => {
      state.view = "finished";
    },

    resetExam: () => initialState,
  },
});

export const {
  initializeExam,
  setView,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  setFlaggedQuestions,
  decrementLife,
  setLives,
  decrementTime,
  finishExam,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
