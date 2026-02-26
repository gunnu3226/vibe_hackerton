"use client";

import { useState, type FormEvent } from "react";

const sections = [
  {
    key: "projectIntro",
    label: "프로젝트 소개",
    placeholder: "프로젝트를 간단히 소개해주세요 (주제, 목표, 대상 등)",
  },
  {
    key: "aiToolsUsed",
    label: "사용한 AI 도구",
    placeholder: "어떤 AI 도구를 활용했나요? (예: ChatGPT, Copilot, Claude 등)",
  },
  {
    key: "aiStrengths",
    label: "AI 활용 장점",
    placeholder: "AI를 활용하면서 좋았던 점은 무엇인가요?",
  },
  {
    key: "aiWeaknesses",
    label: "AI 활용 단점/한계",
    placeholder: "AI를 활용하면서 어려웠거나 한계를 느낀 점은 무엇인가요?",
  },
  {
    key: "insights",
    label: "인사이트 및 느낀 점",
    placeholder: "해커톤을 통해 얻은 인사이트나 느낀 점을 자유롭게 작성해주세요",
  },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export default function SubmitReviewForm({
  teamId,
  onSubmit,
}: {
  teamId: string;
  onSubmit: (data: {
    projectIntro: string;
    aiToolsUsed: string;
    aiStrengths: string;
    aiWeaknesses: string;
    insights: string;
    deployUrl?: string;
    teamId: string;
  }) => Promise<void>;
}) {
  const [fields, setFields] = useState<Record<SectionKey, string>>({
    projectIntro: "",
    aiToolsUsed: "",
    aiStrengths: "",
    aiWeaknesses: "",
    insights: "",
  });
  const [deployUrl, setDeployUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const allFilled = sections.every((s) => fields[s.key].trim());

  const handleChange = (key: SectionKey, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allFilled || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        projectIntro: fields.projectIntro.trim(),
        aiToolsUsed: fields.aiToolsUsed.trim(),
        aiStrengths: fields.aiStrengths.trim(),
        aiWeaknesses: fields.aiWeaknesses.trim(),
        insights: fields.insights.trim(),
        deployUrl: deployUrl.trim() || undefined,
        teamId,
      });
      setFields({
        projectIntro: "",
        aiToolsUsed: "",
        aiStrengths: "",
        aiWeaknesses: "",
        insights: "",
      });
      setDeployUrl("");
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 py-4 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
      >
        + 후기 작성하기
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">후기 작성</h3>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.key}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {section.label}
            </label>
            <textarea
              value={fields[section.key]}
              onChange={(e) => handleChange(section.key, e.target.value)}
              placeholder={section.placeholder}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            배포/GitHub URL (선택)
          </label>
          <input
            type="url"
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!allFilled || submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "제출 중..." : "제출하기"}
        </button>
      </div>
    </form>
  );
}
