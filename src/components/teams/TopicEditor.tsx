"use client";

import { useState } from "react";

export default function TopicEditor({
  currentTopic,
  onSave,
}: {
  currentTopic: string | null;
  onSave: (topic: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [topic, setTopic] = useState(currentTopic ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(topic);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-start gap-2">
        <p className="flex-1 text-sm text-gray-600">
          {currentTopic || "주제 미정"}
        </p>
        <button
          onClick={() => {
            setTopic(currentTopic ?? "");
            setEditing(true);
          }}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          편집
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="프로젝트 주제를 입력하세요"
        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        저장
      </button>
      <button
        onClick={() => setEditing(false)}
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
      >
        취소
      </button>
    </div>
  );
}
