"use client";

import { useEffect, useCallback, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import type { Profile, ChannelType } from "@/lib/types/database";

export default function MembersModal({
  channelType,
  teamId,
  onClose,
}: {
  channelType: ChannelType;
  teamId?: string | null;
  onClose: () => void;
}) {
  const supabase = useSupabase();
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (channelType === "team" && teamId) {
      query = query.eq("team_id", teamId);
    }

    const { data } = await query;
    setMembers((data as Profile[]) ?? []);
    setLoading(false);
  }, [supabase, channelType, teamId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            참여자 ({loading ? "…" : members.length})
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Member list */}
        <div className="max-h-80 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              참여자가 없습니다
            </p>
          ) : (
            <ul className="space-y-1">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
                >
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.display_name}
                      className="h-9 w-9 rounded-full"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                      {member.display_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800">
                    {member.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
