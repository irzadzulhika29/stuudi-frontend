import { useState, useEffect, useRef, useCallback } from "react";
import { useAppDispatch } from "@/shared/store/hooks";
import { setAnswer } from "@/shared/store/slices/examSlice";
import { examService } from "../services/examService";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { QuestionAnswer } from "@/shared/types/questionTypes";

interface UseAutoSaveProps {
  attemptId: string | undefined;
}

const AUTO_SAVE_DEBOUNCE_MS = 200;

export function useAutoSave({ attemptId }: UseAutoSaveProps) {
  const dispatch = useAppDispatch();
  const [pendingSaves, setPendingSaves] = useState<Record<string, QuestionAnswer>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Debounce the pending saves object
  const debouncedPendingSaves = useDebounce(pendingSaves, AUTO_SAVE_DEBOUNCE_MS);

  // Keep track of the last processed batch string to avoid effect loops if needed
  // though clearing pendingSaves should handle it naturally.
  const lastProcessedBatch = useRef<string>("");
  const pendingSavesRef = useRef<Record<string, QuestionAnswer>>({});

  useEffect(() => {
    pendingSavesRef.current = pendingSaves;
  }, [pendingSaves]);

  const saveAnswerLocally = (questionId: string, answer: QuestionAnswer) => {
    // 1. Update Redux immediately (Optimistic UI)
    dispatch(setAnswer({ questionId, answer }));

    // 2. Queue for background save
    setPendingSaves((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const persistAnswers = useCallback(
    async (answersToPersist: Record<string, QuestionAnswer>) => {
      if (!attemptId || Object.keys(answersToPersist).length === 0) return;

      const currentBatchString = JSON.stringify(answersToPersist);
      if (currentBatchString === lastProcessedBatch.current) return;

      setIsSaving(true);
      setSaveError(null);

      try {
        const entries = Object.entries(answersToPersist);
        const keysToClear: string[] = [];

        await Promise.all(
          entries.map(async ([qId, ans]) => {
            const isSaved =
              ans === null
                ? await examService.clearAnswer(attemptId, qId)
                : await examService.saveAnswer(attemptId, qId, ans);

            if (!isSaved) {
              throw new Error(`Failed to persist answer for ${qId}`);
            }

            keysToClear.push(qId);
          })
        );

        if (keysToClear.length > 0) {
          setLastSavedTime(new Date());
          setPendingSaves((prev) => {
            const nextState = { ...prev };
            keysToClear.forEach((key) => {
              const pendingVal = prev[key];
              const savedVal = answersToPersist[key];

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
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [attemptId]
  );

  useEffect(() => {
    const savePendingAnswers = async () => {
      if (Object.keys(debouncedPendingSaves).length === 0) return;
      await persistAnswers(debouncedPendingSaves);
    };

    void savePendingAnswers();
  }, [debouncedPendingSaves, persistAnswers]);

  const flushPendingSaves = useCallback(async () => {
    const snapshot = pendingSavesRef.current;

    if (Object.keys(snapshot).length === 0) return;

    await persistAnswers(snapshot);
  }, [persistAnswers]);

  return {
    saveAnswer: saveAnswerLocally,
    flushPendingSaves,
    isSaving,
    lastSavedTime,
    saveError,
  };
}
