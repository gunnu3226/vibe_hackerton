"use client";

import { useState, useEffect, useCallback } from "react";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useReadCursors } from "@/hooks/useReadCursors";
import { useUser } from "@/hooks/useUser";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MembersModal from "./MembersModal";
import type { ChannelType, Message } from "@/lib/types/database";

export default function ChatRoom({
  channelType,
  teamId,
  title,
}: {
  channelType: ChannelType;
  teamId?: string | null;
  title: string;
}) {
  const [showMembers, setShowMembers] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleNewMessage = useCallback(
    (msg: Message) => {
      if (
        typeof Notification === "undefined" ||
        Notification.permission !== "granted" ||
        !document.hidden ||
        msg.user_id === user?.id
      ) {
        return;
      }

      const sender = msg.profiles?.display_name ?? "알 수 없음";
      const body = msg.image_url ? `${sender}: [사진]` : `${sender}: ${msg.content}`;

      new Notification(title, { body, icon: "/favicon.ico" });
    },
    [user?.id, title],
  );

  const { messages, loading, sendMessage } = useRealtimeMessages({
    channelType,
    teamId,
    onNewMessage: handleNewMessage,
  });
  const { getUnreadCount, updateCursor } = useReadCursors({
    channelType,
    teamId,
    currentUserId: user?.id,
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          onClick={() => setShowMembers(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          참여자
        </button>
      </div>

      {showMembers && (
        <MembersModal
          channelType={channelType}
          teamId={teamId}
          onClose={() => setShowMembers(false)}
        />
      )}
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        getUnreadCount={getUnreadCount}
        updateCursor={updateCursor}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
