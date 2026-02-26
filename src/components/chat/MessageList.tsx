"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types/database";
import MessageItem from "./MessageItem";

export default function MessageList({
  messages,
  currentUserId,
  getUnreadCount,
  updateCursor,
}: {
  messages: Message[];
  currentUserId: string | undefined;
  getUnreadCount: (messageCreatedAt: string) => number;
  updateCursor: () => Promise<void>;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    updateCursor();
  }, [messages, updateCursor]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p>아직 메시지가 없습니다. 첫 번째 메시지를 보내보세요!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-auto p-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwn={message.user_id === currentUserId}
          unreadCount={getUnreadCount(message.created_at)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
