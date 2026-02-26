"use client";

import { useUser } from "@/hooks/useUser";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useUser();
  const supabase = useSupabase();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // signOut API 실패해도 쿠키는 직접 삭제
    }
    // 하드 리다이렉트로 쿠키/세션 완전 초기화
    window.location.href = "/login";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 bg-indigo-100 text-sm font-semibold text-indigo-600">
            {profile?.display_name?.charAt(0) ?? "?"}
          </div>
        )}
        <span className="hidden text-sm font-medium text-gray-700 sm:block">
          {profile?.display_name}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
