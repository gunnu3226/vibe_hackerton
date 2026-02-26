"use client";

import type { Result } from "@/lib/types/database";
import ResultCard from "./ResultCard";

export default function ResultsFeed({ results }: { results: Result[] }) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12">
        <p className="text-lg text-gray-400">아직 결과물이 없습니다</p>
        <p className="mt-1 text-sm text-gray-400">
          팀에 참여하고 결과물을 제출해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {results.map((result) => (
        <ResultCard
          key={result.id}
          result={result}
        />
      ))}
    </div>
  );
}
