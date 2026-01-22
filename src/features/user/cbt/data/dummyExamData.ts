import { ExamData } from "../types/examTypes";

export const dummyExamData: ExamData = {
  id: "exam-001",
  title: "Ujian Akhir",
  subject: "Mata Pelajaran Matematika",
  duration: 3600,
  questions: Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    text: `Bagaimana cara kamu mengetahui hal yang kamu ketahui itu dapat kamu ketahui? (Soal ${i + 1})`,
    image: i % 3 === 0 ? "/images/placeholder/question-image.webp" : undefined,
    options: [
      { label: "A", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "B", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "C", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "D", text: "Dengan saya mengetahui yang saya ketahui." },
      { label: "E", text: "Dengan saya mengetahui yang saya ketahui." },
    ],
  })),
};
