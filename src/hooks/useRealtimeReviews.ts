"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Review } from "@/lib/types/database";

export function useRealtimeReviews() {
  const supabase = useSupabase();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*, profiles(*), teams(*)")
      .order("created_at", { ascending: false });

    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel("reviews-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        () => fetchReviews(),
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, fetchReviews]);

  const submitReview = useCallback(
    async ({
      projectIntro,
      aiToolsUsed,
      aiStrengths,
      aiWeaknesses,
      insights,
      deployUrl,
      teamId,
    }: {
      projectIntro: string;
      aiToolsUsed: string;
      aiStrengths: string;
      aiWeaknesses: string;
      insights: string;
      deployUrl?: string;
      teamId: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("reviews").insert({
        project_intro: projectIntro,
        ai_tools_used: aiToolsUsed,
        ai_strengths: aiStrengths,
        ai_weaknesses: aiWeaknesses,
        insights,
        deploy_url: deployUrl || null,
        team_id: teamId,
        submitted_by: user.id,
      });
    },
    [supabase],
  );

  return { reviews, loading, submitReview };
}
