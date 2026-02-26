"use client";

import { useEffect } from "react";
import { useSession } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(session ? "/chat" : "/login");
    }
  }, [session, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
