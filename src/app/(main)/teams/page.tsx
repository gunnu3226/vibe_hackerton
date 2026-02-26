"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRealtimeTeams } from "@/hooks/useRealtimeTeams";
import TeamList from "@/components/teams/TeamList";
import CreateTeamDialog from "@/components/teams/CreateTeamDialog";

export default function TeamsPage() {
  const { user, profile } = useUser();
  const { teams, loading, createTeam, joinTeam, leaveTeam, updateTopic } =
    useRealtimeTeams();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const hasTeam = !!profile?.team_id;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">팀 결성</h2>
            <p className="mt-1 text-sm text-gray-500">
              팀을 만들거나 참여하세요 (최대 2인)
            </p>
          </div>
          {!hasTeam && (
            <button
              onClick={() => setDialogOpen(true)}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              + 팀 만들기
            </button>
          )}
        </div>

        {hasTeam && (
          <div className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            이미 팀에 소속되어 있습니다. 다른 팀에 참여하려면 먼저 현재 팀을
            나가세요.
          </div>
        )}

        <TeamList
          teams={teams}
          currentUserId={user?.id}
          onJoin={joinTeam}
          onLeave={leaveTeam}
          onUpdateTopic={updateTopic}
        />
      </div>

      <CreateTeamDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={async (name) => {
          await createTeam(name);
        }}
      />
    </div>
  );
}
