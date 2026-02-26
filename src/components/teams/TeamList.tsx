"use client";

import type { TeamWithMembers } from "@/hooks/useRealtimeTeams";
import TeamCard from "./TeamCard";

export default function TeamList({
  teams,
  currentUserId,
  onJoin,
  onLeave,
  onUpdateTopic,
}: {
  teams: TeamWithMembers[];
  currentUserId: string | undefined;
  onJoin: (teamId: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onUpdateTopic: (teamId: string, topic: string) => Promise<void>;
}) {
  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12">
        <p className="text-gray-400">아직 팀이 없습니다</p>
        <p className="mt-1 text-sm text-gray-400">
          첫 번째 팀을 만들어보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          currentUserId={currentUserId}
          onJoin={onJoin}
          onLeave={onLeave}
          onUpdateTopic={onUpdateTopic}
        />
      ))}
    </div>
  );
}
