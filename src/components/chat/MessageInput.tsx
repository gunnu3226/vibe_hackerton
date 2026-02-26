"use client";

import { useState, useRef, type FormEvent } from "react";

export default function MessageInput({
  onSend,
}: {
  onSend: (content: string, imageFile?: File) => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if ((!trimmed && !imageFile) || sending) return;

    setSending(true);
    setContent("");
    const fileToSend = imageFile;
    removeImage();

    try {
      await onSend(trimmed, fileToSend ?? undefined);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      {imagePreview && (
        <div className="mb-3 inline-block relative">
          <img
            src={imagePreview}
            alt="미리보기"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white hover:bg-gray-900"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 rounded-xl border border-gray-300 px-3 py-2.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          title="이미지 첨부"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={(!content.trim() && !imageFile) || sending}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </form>
  );
}
