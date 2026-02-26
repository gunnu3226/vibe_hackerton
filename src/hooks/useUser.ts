"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Profile } from "@/lib/types/database";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(
    async (authUser: User) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        let prof = data as Profile | null;

        // 프로필이 없으면 auth 메타데이터로 생성
        if (!prof) {
          const meta = authUser.user_metadata;
          const { data: created } = await supabase
            .from("profiles")
            .upsert(
              {
                id: authUser.id,
                display_name: meta.full_name || meta.name || "Anonymous",
                avatar_url: meta.avatar_url || meta.picture || null,
              },
              { onConflict: "id" },
            )
            .select()
            .single();
          prof = created as Profile | null;
        }

        // avatar_url이 비어있으면 auth 메타데이터에서 동기화
        if (prof && !prof.avatar_url) {
          const meta = authUser.user_metadata;
          const avatarUrl = meta.avatar_url || meta.picture || null;
          if (avatarUrl) {
            await supabase
              .from("profiles")
              .update({ avatar_url: avatarUrl })
              .eq("id", authUser.id);
            prof = { ...prof, avatar_url: avatarUrl };
          }
        }

        setProfile(prof);
      } catch {
        setProfile(null);
      }
    },
    [supabase],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser);
        }
      } catch {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  return {
    user,
    profile,
    loading,
    refetchProfile: () => user && fetchProfile(user),
  };
}
