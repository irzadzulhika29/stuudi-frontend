import { AdminGlassCard } from "./AdminGlassCard";

interface ExamStatistics {
  exam_id: string;
  exam_title: string;
  passing_score: number;
  statistics: {
    total_attempts: number;
    total_students: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    pass_rate: number;
    passed_students: number;
    failed_students: number;
  };
  attempts: Array<Record<string, unknown>>;
}

interface AdminExamStatsProps {
  data: ExamStatistics;
}

export function AdminExamStats({ data }: AdminExamStatsProps) {
  const { statistics } = data;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Activity */}
      <AdminGlassCard>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Students</p>
            <h3 className="text-2xl font-bold text-neutral-900">{statistics.total_students}</h3>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4">
          <div className="text-xs text-neutral-500">
            Attempts: <span className="text-neutral-900">{statistics.total_attempts}</span>
          </div>
        </div>
      </AdminGlassCard>

      {/* Pass Rate */}
      <AdminGlassCard>
        <div className="flex items-center gap-4">
          <div
            className={`rounded-xl p-3 ${statistics.pass_rate >= 70 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Pass Rate</p>
            <h3 className="text-2xl font-bold text-neutral-900">{statistics.pass_rate}%</h3>
          </div>
        </div>
        <div className="mt-4 flex gap-3 border-t border-neutral-100 pt-4 text-xs">
          <span className="text-emerald-600">{statistics.passed_students} Passed</span>
          <span className="text-neutral-300">|</span>
          <span className="text-rose-600">{statistics.failed_students} Failed</span>
        </div>
      </AdminGlassCard>

      {/* Average Score */}
      <AdminGlassCard>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Average Score</p>
            <h3 className="text-2xl font-bold text-neutral-900">
              {statistics.average_score.toFixed(1)}
            </h3>
          </div>
        </div>
        <div className="mt-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
          Passing Score: <span className="text-neutral-900">{data.passing_score}</span>
        </div>
      </AdminGlassCard>

      {/* Score Range */}
      <AdminGlassCard>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Best Score</p>
            <h3 className="text-2xl font-bold text-neutral-900">{statistics.highest_score}</h3>
          </div>
        </div>
        <div className="mt-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
          Lowest Score: <span className="text-neutral-900">{statistics.lowest_score}</span>
        </div>
      </AdminGlassCard>
    </div>
  );
}
