"use client";

import { useState, type FormEvent } from "react";
import type { Review } from "@/lib/types/database";

const sectionLabels: { key: keyof Review; field: string; label: string }[] = [
  { key: "project_intro", field: "projectIntro", label: "프로젝트 소개" },
  { key: "ai_tools_used", field: "aiToolsUsed", label: "사용한 AI 도구" },
  { key: "ai_strengths", field: "aiStrengths", label: "AI 활용 장점" },
  { key: "ai_weaknesses", field: "aiWeaknesses", label: "AI 활용 단점/한계" },
  { key: "insights", field: "insights", label: "인사이트 및 느낀 점" },
];

type EditFields = {
  projectIntro: string;
  aiToolsUsed: string;
  aiStrengths: string;
  aiWeaknesses: string;
  insights: string;
  deployUrl: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function reviewToFields(review: Review): EditFields {
  return {
    projectIntro: review.project_intro,
    aiToolsUsed: review.ai_tools_used,
    aiStrengths: review.ai_strengths,
    aiWeaknesses: review.ai_weaknesses,
    insights: review.insights,
    deployUrl: review.deploy_url ?? "",
  };
}

export default function ReviewCard({
  review,
  isOwner,
  onUpdate,
}: {
  review: Review;
  isOwner: boolean;
  onUpdate: (data: {
    id: string;
    projectIntro: string;
    aiToolsUsed: string;
    aiStrengths: string;
    aiWeaknesses: string;
    insights: string;
    deployUrl?: string;
  }) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<EditFields>(() => reviewToFields(review));
  const [submitting, setSubmitting] = useState(false);

  const profile = review.profiles;
  const team = review.teams;

  const handleEdit = () => {
    setFields(reviewToFields(review));
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await onUpdate({
        id: review.id,
        projectIntro: fields.projectIntro.trim(),
        aiToolsUsed: fields.aiToolsUsed.trim(),
        aiStrengths: fields.aiStrengths.trim(),
        aiWeaknesses: fields.aiWeaknesses.trim(),
        insights: fields.insights.trim(),
        deployUrl: fields.deployUrl.trim() || undefined,
      });
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  const allFilled = sectionLabels.every(
    ({ field }) => fields[field as keyof EditFields].trim(),
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          {team && (
            <h3 className="text-lg font-semibold text-indigo-600">
              {team.name}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isOwner && !editing && (
            <button
              onClick={handleEdit}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              수정
            </button>
          )}
          <span className="text-xs text-gray-400">
            {formatDate(review.created_at)}
          </span>
        </div>
      </div>

      {/* Content or Edit Form */}
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            {sectionLabels.map(({ field, label }) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  {label}
                </label>
                <textarea
                  value={fields[field as keyof EditFields]}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                배포/GitHub URL (선택)
              </label>
              <input
                type="url"
                value={fields.deployUrl}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, deployUrl: e.target.value }))
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!allFilled || submitting}
              className="rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="space-y-3">
            {sectionLabels.map(({ key, label }) => (
              <div key={key}>
                <p className="text-xs font-semibold text-gray-500">{label}</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {review[key] as string}
                </p>
              </div>
            ))}
          </div>

          {review.deploy_url && (
            <a
              href={review.deploy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
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
        </>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
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
          {profile?.display_name ?? "Unknown"} 작성
        </span>
      </div>
    </div>
  );
}
