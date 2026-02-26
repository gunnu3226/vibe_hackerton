"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { ChannelReadCursor, ChannelType } from "@/lib/types/database";

function getChannelId(
  channelType: ChannelType,
  teamId?: string | null,
): string {
  return channelType === "team" && teamId ? `team:${teamId}` : "global";
}

export function useReadCursors({
  channelType,
  teamId,
  currentUserId,
}: {
  channelType: ChannelType;
  teamId?: string | null;
  currentUserId: string | undefined;
}) {
  const supabase = useSupabase();
  const [cursors, setCursors] = useState<ChannelReadCursor[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const channelId = getChannelId(channelType, teamId);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchCursors = useCallback(async () => {
    const { data } = await supabase
      .from("channel_read_cursors")
      .select("*")
      .eq("channel_id", channelId);

    setCursors((data as ChannelReadCursor[]) ?? []);
  }, [supabase, channelId]);

  const fetchMemberCount = useCallback(async () => {
    if (channelType === "global") {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setMemberCount(count ?? 0);
    } else if (teamId) {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("team_id", teamId);
      setMemberCount(count ?? 0);
    }
  }, [supabase, channelType, teamId]);

  useEffect(() => {
    fetchCursors();
    fetchMemberCount();

    const channel = supabase
      .channel(`read-cursors-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channel_read_cursors",
          filter: `channel_id=eq.${channelId}`,
        },
        () => fetchCursors(),
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, channelId, fetchCursors, fetchMemberCount]);

  const getUnreadCount = useCallback(
    (messageCreatedAt: string): number => {
      if (memberCount === 0) return 0;
      const msgTime = new Date(messageCreatedAt).getTime();
      const readCount = cursors.filter(
        (c) => new Date(c.last_read_at).getTime() >= msgTime,
      ).length;
      return Math.max(0, memberCount - readCount);
    },
    [cursors, memberCount],
  );

  const updateCursor = useCallback(async () => {
    if (!currentUserId) return;

    const now = new Date().toISOString();
    await supabase.from("channel_read_cursors").upsert(
      {
        user_id: currentUserId,
        channel_id: channelId,
        last_read_at: now,
      },
      { onConflict: "user_id,channel_id" },
    );
  }, [supabase, currentUserId, channelId]);

  return { getUnreadCount, updateCursor };
}
