"use client";

import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useUser } from "@/hooks/useUser";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { ChannelType } from "@/lib/types/database";

export default function ChatRoom({
  channelType,
  teamId,
  title,
}: {
  channelType: ChannelType;
  teamId?: string | null;
  title: string;
}) {
  const { messages, loading, sendMessage } = useRealtimeMessages({
    channelType,
    teamId,
  });
  const { user } = useUser();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <MessageList
        messages={messages}
        currentUserId={user?.id}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
