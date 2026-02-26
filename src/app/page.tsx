"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "@/providers/SupabaseProvider";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const { session, loading } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
