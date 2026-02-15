import { ExamData } from "../types/examTypes";

export const dummyExamData: ExamData = {
  exam_id: "dummy-exam-001",
  title: "Ujian Tengah Semester",
  subject: "Matematika Dasar",
  duration: 60, // in minutes
  questions: [
    {
      question_id: "q1",
      question_text: "Berapakah hasil dari 2 + 3?",
      question_type: "single",
      points: 10,
      options: [
        { option_id: "q1_a", option_text: "3", sequence: 1 },
        { option_id: "q1_b", option_text: "4", sequence: 2 },
        { option_id: "q1_c", option_text: "5", sequence: 3 },
        { option_id: "q1_d", option_text: "6", sequence: 4 },
      ],
    },
    {
      question_id: "q2",
      question_text: "Manakah yang merupakan bilangan prima?",
      question_type: "single",
      points: 10,
      options: [
        { option_id: "q2_a", option_text: "4", sequence: 1 },
        { option_id: "q2_b", option_text: "6", sequence: 2 },
        { option_id: "q2_c", option_text: "7", sequence: 3 },
        { option_id: "q2_d", option_text: "9", sequence: 4 },
      ],
    },
    {
      question_id: "q3",
      question_text: "Hasil dari 10 x 5 adalah...",
      question_type: "single",
      points: 10,
      options: [
        { option_id: "q3_a", option_text: "45", sequence: 1 },
        { option_id: "q3_b", option_text: "50", sequence: 2 },
        { option_id: "q3_c", option_text: "55", sequence: 3 },
        { option_id: "q3_d", option_text: "60", sequence: 4 },
      ],
    },
    {
      question_id: "q4",
      question_text: "Berapakah akar kuadrat dari 144?",
      question_type: "single",
      points: 10,
      options: [
        { option_id: "q4_a", option_text: "10", sequence: 1 },
        { option_id: "q4_b", option_text: "11", sequence: 2 },
        { option_id: "q4_c", option_text: "12", sequence: 3 },
        { option_id: "q4_d", option_text: "14", sequence: 4 },
      ],
    },
    {
      question_id: "q5",
      question_text: "Jika x = 3, berapakah nilai dari 2x + 4?",
      question_type: "single",
      points: 10,
      options: [
        { option_id: "q5_a", option_text: "8", sequence: 1 },
        { option_id: "q5_b", option_text: "10", sequence: 2 },
        { option_id: "q5_c", option_text: "12", sequence: 3 },
        { option_id: "q5_d", option_text: "14", sequence: 4 },
      ],
    },
  ],
};
