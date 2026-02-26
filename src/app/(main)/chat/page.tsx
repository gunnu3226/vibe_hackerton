"use client";

import ChatRoom from "@/components/chat/ChatRoom";

export default function GlobalChatPage() {
  return (
    <ChatRoom
      channelType="global"
      title="단체 채팅방"
    />
  );
}
