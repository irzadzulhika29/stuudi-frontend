import { QuizItem } from "../containers/QuizFormContainer";
import { countCorrectAnswers } from "./quizTransformers";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validasi nama quiz
 */
export function validateQuizName(name: string): ValidationResult {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      isValid: false,
      error: "Nama quiz harus diisi",
    };
  }

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      error: "Nama quiz minimal 3 karakter",
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Nama quiz maksimal 100 karakter",
    };
  }

  return { isValid: true };
}

/**
 * Validasi array quiz items
 */
export function validateQuizItems(items: QuizItem[]): ValidationResult {
  if (items.length === 0) {
    return {
      isValid: false,
      error: "Quiz harus memiliki minimal 1 pertanyaan",
    };
  }

  // Validasi setiap item
  for (let i = 0; i < items.length; i++) {
    const itemValidation = validateQuizItem(items[i]);
    if (!itemValidation.isValid) {
      return {
        isValid: false,
        error: `Pertanyaan ${i + 1}: ${itemValidation.error}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Validasi individual quiz item
 */
export function validateQuizItem(item: QuizItem): ValidationResult {
  // Validasi pertanyaan tidak kosong
  if (!item.data.question.trim()) {
    return {
      isValid: false,
      error: "Pertanyaan tidak boleh kosong",
    };
  }

  // Validasi berdasarkan tipe soal
  switch (item.data.questionType) {
    case "single":
      return validateSingleChoice(item);
    case "multiple":
      return validateMultipleChoice(item);
    case "matching":
      return validateMatching(item);
    default:
      return {
        isValid: false,
        error: "Tipe soal tidak valid",
      };
  }
}

/**
 * Validasi soal single choice
 */
export function validateSingleChoice(item: QuizItem): ValidationResult {
  if (item.data.questionType !== "single") {
    return { isValid: false, error: "Bukan tipe single choice" };
  }

  const options = item.data.options;

  // Minimal 2 opsi
  if (!options || options.length < 2) {
    return {
      isValid: false,
      error: "Single choice harus memiliki minimal 2 opsi jawaban",
    };
  }

  // Semua opsi harus terisi
  const emptyOptions = options.filter((opt) => !opt.text.trim());
  if (emptyOptions.length > 0) {
    return {
      isValid: false,
      error: "Semua opsi jawaban harus diisi",
    };
  }

  // Harus ada tepat 1 jawaban benar
  const correctCount = countCorrectAnswers(options);
  if (correctCount === 0) {
    return {
      isValid: false,
      error: "Single choice harus memiliki 1 jawaban benar",
    };
  }

  if (correctCount > 1) {
    return {
      isValid: false,
      error: "Single choice hanya boleh memiliki 1 jawaban benar",
    };
  }

  return { isValid: true };
}

/**
 * Validasi soal multiple choice
 */
export function validateMultipleChoice(item: QuizItem): ValidationResult {
  if (item.data.questionType !== "multiple") {
    return { isValid: false, error: "Bukan tipe multiple choice" };
  }

  const options = item.data.options;

  // Minimal 2 opsi
  if (!options || options.length < 2) {
    return {
      isValid: false,
      error: "Multiple choice harus memiliki minimal 2 opsi jawaban",
    };
  }

  // Semua opsi harus terisi
  const emptyOptions = options.filter((opt) => !opt.text.trim());
  if (emptyOptions.length > 0) {
    return {
      isValid: false,
      error: "Semua opsi jawaban harus diisi",
    };
  }

  // Harus ada minimal 2 jawaban benar untuk multiple choice
  const correctCount = countCorrectAnswers(options);
  if (correctCount === 0) {
    return {
      isValid: false,
      error: "Multiple choice harus memiliki minimal 1 jawaban benar",
    };
  }

  if (correctCount === 1) {
    return {
      isValid: false,
      error:
        "Multiple choice harus memiliki lebih dari 1 jawaban benar. Gunakan Single Choice jika hanya 1 jawaban benar",
    };
  }

  // Tidak boleh semua opsi benar
  if (correctCount === options.length) {
    return {
      isValid: false,
      error: "Tidak semua opsi boleh benar. Minimal harus ada 1 opsi yang salah",
    };
  }

  return { isValid: true };
}

/**
 * Validasi soal matching
 */
export function validateMatching(item: QuizItem): ValidationResult {
  if (item.data.questionType !== "matching") {
    return { isValid: false, error: "Bukan tipe matching" };
  }

  const pairs = item.data.pairs;

  // Minimal 2 pasangan
  if (!pairs || pairs.length < 2) {
    return {
      isValid: false,
      error: "Matching harus memiliki minimal 2 pasangan",
    };
  }

  // Semua pasangan harus terisi (left dan right)
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (!pair.left.trim()) {
      return {
        isValid: false,
        error: `Pasangan ${i + 1}: Pertanyaan (kiri) tidak boleh kosong`,
      };
    }
    if (!pair.right.trim()) {
      return {
        isValid: false,
        error: `Pasangan ${i + 1}: Jawaban (kanan) tidak boleh kosong`,
      };
    }
  }

  // Cek duplikasi pada left side
  const leftValues = pairs.map((p) => p.left.trim().toLowerCase());
  const uniqueLeftValues = new Set(leftValues);
  if (uniqueLeftValues.size !== leftValues.length) {
    return {
      isValid: false,
      error: "Pertanyaan (kiri) tidak boleh ada yang sama",
    };
  }

  // Cek duplikasi pada right side
  const rightValues = pairs.map((p) => p.right.trim().toLowerCase());
  const uniqueRightValues = new Set(rightValues);
  if (uniqueRightValues.size !== rightValues.length) {
    return {
      isValid: false,
      error: "Jawaban (kanan) tidak boleh ada yang sama",
    };
  }

  return { isValid: true };
}

/**
 * Helper untuk mendapatkan pesan error yang user-friendly
 */
export function getValidationErrorMessage(error: string): string {
  return error || "Terjadi kesalahan validasi";
}
