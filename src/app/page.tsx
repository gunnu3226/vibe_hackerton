"use client";

import { useEffect } from "react";
import { useSession } from "@/providers/SupabaseProvider";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // OAuth 콜백 code가 루트로 온 경우 → /auth/callback으로 전달
    const code = searchParams.get("code");
    if (code) {
      router.replace(`/auth/callback?code=${code}`);
      return;
    }

    if (!loading) {
      router.replace(session ? "/chat" : "/login");
    }
  }, [session, loading, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
