"use client";

import { useUser } from "@/hooks/useUser";
import ChatRoom from "@/components/chat/ChatRoom";

export default function TeamChatPage() {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!profile?.team_id) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-lg font-medium text-gray-500">
          팀에 참여해야 이용할 수 있습니다
        </p>
        <a
          href="/teams"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          팀 결성 페이지로 이동
        </a>
      </div>
    );
  }

  return (
    <ChatRoom
      channelType="team"
      teamId={profile.team_id}
      title="팀 채팅방"
    />
  );
}
