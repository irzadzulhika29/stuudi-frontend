"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ExamView = "exam" | "summary" | "finished";

interface ExamState {
  view: ExamView;
  currentIndex: number;
  answers: Record<number, string>;
  flaggedQuestions: number[];
  lives: number;
  maxLives: number;
  timeRemaining: number;
  isInitialized: boolean;
}

const initialState: ExamState = {
  view: "exam",
  currentIndex: 0,
  answers: {},
  flaggedQuestions: [],
  lives: 3,
  maxLives: 3,
  timeRemaining: 0,
  isInitialized: false,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    initializeExam: (state, action: PayloadAction<{ duration: number; maxLives?: number }>) => {
      state.view = "exam";
      state.currentIndex = 0;
      state.answers = {};
      state.flaggedQuestions = [];
      state.lives = action.payload.maxLives ?? 3;
      state.maxLives = action.payload.maxLives ?? 3;
      state.timeRemaining = action.payload.duration;
      state.isInitialized = true;
    },

    setView: (state, action: PayloadAction<ExamView>) => {
      state.view = action.payload;
    },

    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },

    setAnswer: (state, action: PayloadAction<{ questionId: number; answer: string }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },

    toggleFlag: (state, action: PayloadAction<number>) => {
      const questionId = action.payload;
      const index = state.flaggedQuestions.indexOf(questionId);
      if (index === -1) {
        state.flaggedQuestions.push(questionId);
      } else {
        state.flaggedQuestions.splice(index, 1);
      }
    },

    decrementLife: (state) => {
      if (state.lives > 0) {
        state.lives -= 1;
      }
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
  decrementLife,
  decrementTime,
  finishExam,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
