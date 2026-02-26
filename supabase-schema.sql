-- Culture Day 해커톤 컴패니언 - Supabase SQL Schema
-- Supabase Dashboard > SQL Editor에서 실행하세요.

-- 1. channel_type ENUM
CREATE TYPE public.channel_type AS ENUM ('global', 'team');

-- 2. teams 테이블
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  topic TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. profiles 테이블
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  team_id UUID REFERENCES public.teams ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. teams.created_by FK (profiles must exist first)
ALTER TABLE public.teams
  ADD CONSTRAINT teams_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id);

-- 5. messages 테이블
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  channel_type public.channel_type NOT NULL DEFAULT 'global',
  team_id UUID REFERENCES public.teams ON DELETE CASCADE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. results 테이블
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. 인덱스
CREATE INDEX idx_messages_channel ON public.messages(channel_type, team_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_profiles_team ON public.profiles(team_id);
CREATE INDEX idx_results_team ON public.results(team_id);

-- 8. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- 9. RLS 정책

-- profiles: 모든 인증된 사용자가 조회 가능, 본인만 수정 가능
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- teams: 모든 인증된 사용자가 조회/생성 가능, 생성자만 수정 가능
CREATE POLICY "Teams are viewable by authenticated users"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their team"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- messages: 모든 인증된 사용자가 조회 가능 (global), 팀 메시지는 팀원만
CREATE POLICY "Global messages are viewable by authenticated users"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    channel_type = 'global'
    OR (
      channel_type = 'team'
      AND team_id IN (SELECT team_id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- results: 모든 인증된 사용자가 조회 가능, 팀원만 제출 가능
CREATE POLICY "Results are viewable by authenticated users"
  ON public.results FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Team members can submit results"
  ON public.results FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = submitted_by
    AND team_id IN (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );

-- 10. Realtime 활성화
-- Supabase Dashboard > Database > Replication에서 아래 테이블을 활성화하세요:
-- - messages
-- - teams
-- - profiles
-- - results
-- 또는 아래 SQL을 실행하세요:
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.results;
