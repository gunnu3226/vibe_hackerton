"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Result } from "@/lib/types/database";

export function useRealtimeResults() {
  const supabase = useSupabase();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    const { data } = await supabase
      .from("results")
      .select("*, profiles(*), teams(*)")
      .order("created_at", { ascending: false });

    setResults((data as Result[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("results-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "results" },
        () => fetchResults(),
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, fetchResults]);

  const submitResult = useCallback(
    async ({
      title,
      description,
      url,
      teamId,
    }: {
      title: string;
      description: string;
      url?: string;
      teamId: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("results").insert({
        title,
        description,
        url: url || null,
        team_id: teamId,
        submitted_by: user.id,
      });
    },
    [supabase],
  );

  return { results, loading, submitResult };
}
