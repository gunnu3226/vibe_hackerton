"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Message, ChannelType } from "@/lib/types/database";

export function useRealtimeMessages({
  channelType,
  teamId,
}: {
  channelType: ChannelType;
  teamId?: string | null;
}) {
  const supabase = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      let query = supabase
        .from("messages")
        .select("*, profiles(*)")
        .eq("channel_type", channelType)
        .order("created_at", { ascending: true });

      if (channelType === "team" && teamId) {
        query = query.eq("team_id", teamId);
      }

      const { data } = await query;
      setMessages((data as Message[]) ?? []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, channelType, teamId]);

  useEffect(() => {
    fetchMessages();

    const channelName =
      channelType === "global" ? "global-chat" : `team-chat-${teamId}`;

    const filter =
      channelType === "team" && teamId
        ? `channel_type=eq.team&team_id=eq.${teamId}`
        : `channel_type=eq.global`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter,
        },
        async (payload) => {
          try {
            const { data } = await supabase
              .from("messages")
              .select("*, profiles(*)")
              .eq("id", (payload.new as { id: string }).id)
              .single();

            if (data) {
              const msg = data as Message;
              setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
            }
          } catch {
            // ignore realtime fetch errors
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, channelType, teamId, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("messages").insert({
        content,
        user_id: user.id,
        channel_type: channelType,
        team_id: channelType === "team" ? teamId ?? null : null,
      });
    },
    [supabase, channelType, teamId],
  );

  return { messages, loading, sendMessage };
}
