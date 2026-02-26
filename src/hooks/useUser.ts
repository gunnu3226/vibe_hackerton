"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase, useSession } from "@/providers/SupabaseProvider";
import type { Profile } from "@/lib/types/database";

export function useUser() {
  const supabase = useSupabase();
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const user = session?.user;
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      let prof = data as Profile | null;

      if (!prof) {
        const meta = user.user_metadata;
        const { data: created } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              display_name: meta.full_name || meta.name || "Anonymous",
              avatar_url: meta.avatar_url || meta.picture || null,
            },
            { onConflict: "id" },
          )
          .select()
          .single();
        prof = created as Profile | null;
      }

      if (prof && !prof.avatar_url) {
        const meta = user.user_metadata;
        const avatarUrl = meta.avatar_url || meta.picture || null;
        if (avatarUrl) {
          await supabase
            .from("profiles")
            .update({ avatar_url: avatarUrl })
            .eq("id", user.id);
          prof = { ...prof, avatar_url: avatarUrl };
        }
      }

      setProfile(prof);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [supabase, session]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchProfile();
    }
  }, [sessionLoading, fetchProfile]);

  return {
    user: session?.user ?? null,
    profile,
    loading: sessionLoading || profileLoading,
    refetchProfile: fetchProfile,
  };
}
