import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/chat";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const meta = data.user.user_metadata;

      // service_role 클라이언트로 프로필 upsert (RLS 우회)
      const serviceClient = createServiceClient();
      const { error: upsertError } = await serviceClient
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            display_name: meta.full_name || meta.name || "Anonymous",
            avatar_url: meta.avatar_url || meta.picture || null,
          },
          { onConflict: "id" },
        );

      if (upsertError) {
        console.error("Profile upsert failed:", upsertError);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
