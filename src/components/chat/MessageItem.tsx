"use client";

import type { Message } from "@/lib/types/database";

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function MessageItem({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const profile = message.profiles;

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <div className="flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
              {profile?.display_name?.charAt(0) ?? "?"}
            </div>
          )}
        </div>
      )}

      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <p className="mb-1 text-xs font-medium text-gray-500">
            {profile?.display_name ?? "Unknown"}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-900 shadow-sm"
          }`}
        >
          {message.image_url && (
            <a
              href={message.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={message.image_url}
                alt="첨부 이미지"
                className={`max-w-full rounded-lg ${message.content ? "mb-2" : ""}`}
                style={{ maxHeight: "300px" }}
              />
            </a>
          )}
          {message.content && (
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.content}
            </p>
          )}
        </div>
        <p
          className={`mt-1 text-xs text-gray-400 ${isOwn ? "text-right" : ""}`}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
