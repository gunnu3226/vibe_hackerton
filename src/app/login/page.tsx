"use client";

import { useEffect } from "react";
import { useSupabase, useSession } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = useSupabase();
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/chat");
    }
  }, [session, loading, router]);

  const handleSlackLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Culture Day
          </h1>
          <p className="text-lg text-gray-500">
            전사 AI 역량 전환 컬쳐데이 해커톤
          </p>
        </div>

        <button
          onClick={handleSlackLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#4A154B] px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-[#3a1139] hover:shadow-md active:scale-[0.98]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
          </svg>
          Slack으로 로그인
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          똑똑한개발자 슬랙 계정으로 참가하세요
        </p>
      </div>
    </div>
  );
}
