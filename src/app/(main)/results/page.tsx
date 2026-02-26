"use client";

import { useUser } from "@/hooks/useUser";
import { useRealtimeResults } from "@/hooks/useRealtimeResults";
import ResultsFeed from "@/components/results/ResultsFeed";
import SubmitResultForm from "@/components/results/SubmitResultForm";

export default function ResultsPage() {
  const { profile } = useUser();
  const { results, loading, submitResult } = useRealtimeResults();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">결과물 피드</h2>
          <p className="mt-1 text-sm text-gray-500">
            팀별 프로젝트 결과물을 확인하세요
          </p>
        </div>

        {profile?.team_id && (
          <div className="mb-6">
            <SubmitResultForm
              teamId={profile.team_id}
              onSubmit={submitResult}
            />
          </div>
        )}

        <ResultsFeed results={results} />
      </div>
    </div>
  );
}
