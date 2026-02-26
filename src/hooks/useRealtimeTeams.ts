"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Team, Profile } from "@/lib/types/database";

export interface TeamWithMembers extends Team {
  members: Profile[];
}

export function useRealtimeTeams() {
  const supabase = useSupabase();
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = useCallback(async () => {
    const { data: teamsData } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: true });

    if (!teamsData) {
      setTeams([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .not("team_id", "is", null);

    const teamsWithMembers: TeamWithMembers[] = (teamsData as Team[]).map(
      (team) => ({
        ...team,
        members: ((profiles as Profile[]) ?? []).filter(
          (p) => p.team_id === team.id,
        ),
      }),
    );

    setTeams(teamsWithMembers);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTeams();

    const teamsChannel = supabase
      .channel("teams-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        () => fetchTeams(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => fetchTeams(),
      )
      .subscribe();

    return () => {
      teamsChannel.unsubscribe();
    };
  }, [supabase, fetchTeams]);

  const createTeam = useCallback(
    async (name: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: team } = await supabase
        .from("teams")
        .insert({ name, created_by: user.id })
        .select()
        .single();

      if (team) {
        await supabase
          .from("profiles")
          .update({ team_id: (team as Team).id })
          .eq("id", user.id);
      }

      return team as Team;
    },
    [supabase],
  );

  const joinTeam = useCallback(
    async (teamId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("profiles")
        .update({ team_id: teamId })
        .eq("id", user.id);
    },
    [supabase],
  );

  const leaveTeam = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ team_id: null })
      .eq("id", user.id);
  }, [supabase]);

  const updateTopic = useCallback(
    async (
      teamId: string,
      topic: string,
    ) => {
      await supabase.from("teams").update({ topic }).eq("id", teamId);
    },
    [supabase],
  );

  return { teams, loading, createTeam, joinTeam, leaveTeam, updateTopic };
}
