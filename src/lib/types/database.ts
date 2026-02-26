export type ChannelType = "global" | "team";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  team_id: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  topic: string | null;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  channel_type: ChannelType;
  team_id: string | null;
  image_url: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Result {
  id: string;
  team_id: string;
  title: string;
  description: string;
  url: string | null;
  submitted_by: string;
  created_at: string;
  profiles?: Profile;
  teams?: Team;
}

export interface ProfileInsert {
  id: string;
  display_name: string;
  avatar_url?: string | null;
  team_id?: string | null;
}

export interface TeamInsert {
  name: string;
  created_by: string;
  topic?: string | null;
}

export interface MessageInsert {
  content: string;
  user_id: string;
  channel_type: ChannelType;
  team_id?: string | null;
  image_url?: string | null;
}

export interface ResultInsert {
  team_id: string;
  title: string;
  description: string;
  url?: string | null;
  submitted_by: string;
}

export interface Review {
  id: string;
  team_id: string;
  project_intro: string;
  ai_tools_used: string;
  ai_strengths: string;
  ai_weaknesses: string;
  insights: string;
  deploy_url: string | null;
  submitted_by: string;
  created_at: string;
  profiles?: Profile;
  teams?: Team;
}

export interface ReviewInsert {
  team_id: string;
  project_intro: string;
  ai_tools_used: string;
  ai_strengths: string;
  ai_weaknesses: string;
  insights: string;
  deploy_url?: string | null;
  submitted_by: string;
}

export interface ChannelReadCursor {
  id: string;
  user_id: string;
  channel_id: string;
  last_read_at: string;
}

export interface ChannelReadCursorUpsert {
  user_id: string;
  channel_id: string;
  last_read_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: Partial<TeamInsert>;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
      };
      results: {
        Row: Result;
        Insert: ResultInsert;
        Update: Partial<ResultInsert>;
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: Partial<ReviewInsert>;
      };
      channel_read_cursors: {
        Row: ChannelReadCursor;
        Insert: ChannelReadCursorUpsert;
        Update: Partial<ChannelReadCursorUpsert>;
      };
    };
    Enums: {
      channel_type: ChannelType;
    };
  };
}
