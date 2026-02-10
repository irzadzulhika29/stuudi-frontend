import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/shared/store/hooks";
import { setAnswer } from "@/shared/store/slices/examSlice";
import { examService } from "../services/examService";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { QuestionAnswer } from "@/shared/types/questionTypes";

interface UseAutoSaveProps {
  attemptId: string | undefined;
}

export function useAutoSave({ attemptId }: UseAutoSaveProps) {
  const dispatch = useAppDispatch();
  const [pendingSaves, setPendingSaves] = useState<Record<string, QuestionAnswer>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Debounce the pending saves object
  const debouncedPendingSaves = useDebounce(pendingSaves, 1000);

  // Keep track of the last processed batch string to avoid effect loops if needed
  // though clearing pendingSaves should handle it naturally.
  const lastProcessedBatch = useRef<string>("");

  const saveAnswerLocally = (questionId: string, answer: QuestionAnswer) => {
    // 1. Update Redux immediately (Optimistic UI)
    dispatch(setAnswer({ questionId, answer }));

    // 2. Queue for background save
    setPendingSaves((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  useEffect(() => {
    const savePendingAnswers = async () => {
      if (!attemptId) return;

      // If nothing pending, do nothing
      if (Object.keys(debouncedPendingSaves).length === 0) return;

      // Avoid re-processing the exact same batch if something persists (safety check)
      const currentBatchString = JSON.stringify(debouncedPendingSaves);
      if (currentBatchString === lastProcessedBatch.current) return;

      setIsSaving(true);
      setSaveError(null);

      try {
        const entries = Object.entries(debouncedPendingSaves);
        const keysToClear: string[] = [];

        // Save sequentially or parallel? Parallel is fine for small batches.
        await Promise.all(
          entries.map(async ([qId, ans]) => {
            try {
              if (ans === null) {
                await examService.clearAnswer(attemptId, qId);
              } else {
                await examService.saveAnswer(attemptId, qId, ans);
              }
              keysToClear.push(qId);
            } catch (innerErr) {
              console.error(`Failed to save question ${qId}`, innerErr);
              // We don't add it to keysToClear, so it remains pending/retries?
              // Or we might want to flag it as error.
            }
          })
        );

        // If at least one success
        if (keysToClear.length > 0) {
          setLastSavedTime(new Date());

          // Remove successfully saved items from pendingSaves
          setPendingSaves((prev) => {
            const nextState = { ...prev };
            keysToClear.forEach((key) => {
              // Only remove if the value hasn't changed since we started saving
              // (Simple check: direct equality might not work for deep objects/arrays,
              // but debouncedPendingSaves[key] is our snapshot reference)

              // Safer approach: Delete blindly? No, user might have edited again.
              // If user edited again, 'prev[key]' would be different from 'debouncedPendingSaves[key]'.
              // But 'useDebounce' gives us the value X seconds ago.
              // If prev[key] !== debouncedPendingSaves[key], keep it.

              const pendingVal = prev[key];
              const savedVal = debouncedPendingSaves[key];

              // JSON stringify comparison for safety
              if (JSON.stringify(pendingVal) === JSON.stringify(savedVal)) {
                delete nextState[key];
              }
            });
            return nextState;
          });
        }

        lastProcessedBatch.current = currentBatchString;
      } catch (err) {
        console.error("Auto-save batch failed:", err);
        setSaveError("Gagal menyimpan beberapa jawaban. Cek koneksi.");
      } finally {
        setIsSaving(false);
      }
    };

    savePendingAnswers();
  }, [debouncedPendingSaves, attemptId]);

  return {
    saveAnswer: saveAnswerLocally,
    isSaving,
    lastSavedTime,
    saveError,
  };
}
