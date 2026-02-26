"use client";

import type { TeamWithMembers } from "@/hooks/useRealtimeTeams";
import TopicEditor from "./TopicEditor";

const MAX_MEMBERS = 2;

export default function TeamCard({
  team,
  currentUserId,
  onJoin,
  onLeave,
  onUpdateTopic,
}: {
  team: TeamWithMembers;
  currentUserId: string | undefined;
  onJoin: (teamId: string) => Promise<void>;
  onLeave: () => Promise<void>;
  onUpdateTopic: (teamId: string, topic: string) => Promise<void>;
}) {
  const isMember = team.members.some((m) => m.id === currentUserId);
  const isFull = team.members.length >= MAX_MEMBERS;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isFull
              ? "bg-gray-100 text-gray-500"
              : "bg-green-100 text-green-700"
          }`}
        >
          {team.members.length}/{MAX_MEMBERS}
        </span>
      </div>

      {/* Topic */}
      <div className="mb-4">
        <p className="mb-1 text-xs font-medium text-gray-400">프로젝트 주제</p>
        {isMember ? (
          <TopicEditor
            currentTopic={team.topic}
            onSave={(topic) => onUpdateTopic(team.id, topic)}
          />
        ) : (
          <p className="text-sm text-gray-600">{team.topic || "주제 미정"}</p>
        )}
      </div>

      {/* Members */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-gray-400">멤버</p>
        <div className="flex gap-2">
          {team.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pr-3 pl-1"
            >
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.display_name}
                  className="h-5 w-5 rounded-full"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-200 text-xs font-medium text-indigo-700">
                  {member.display_name.charAt(0)}
                </div>
              )}
              <span className="text-xs font-medium text-gray-700">
                {member.display_name}
              </span>
            </div>
          ))}
          {team.members.length === 0 && (
            <p className="text-xs text-gray-400">아직 멤버가 없습니다</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {isMember ? (
        <button
          onClick={onLeave}
          className="w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          팀 나가기
        </button>
      ) : (
        <button
          onClick={() => onJoin(team.id)}
          disabled={isFull}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFull ? "인원 초과" : "팀 참여하기"}
        </button>
      )}
    </div>
  );
}
