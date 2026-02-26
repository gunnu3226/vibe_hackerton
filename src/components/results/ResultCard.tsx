"use client";

import type { Result } from "@/lib/types/database";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResultCard({ result }: { result: Result }) {
  const profile = result.profiles;
  const team = result.teams;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {result.title}
          </h3>
          {team && (
            <p className="text-sm font-medium text-indigo-600">{team.name}</p>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(result.created_at)}
        </span>
      </div>

      <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
        {result.description}
      </p>

      {result.url && (
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          링크 열기
        </a>
      )}

      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
            {profile?.display_name?.charAt(0) ?? "?"}
          </div>
        )}
        <span className="text-xs text-gray-500">
          {profile?.display_name ?? "Unknown"} 제출
        </span>
      </div>
    </div>
  );
}
