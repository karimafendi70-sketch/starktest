export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  category: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface SobrietySession {
  id: string;
  user_id: string;
  habit_id: string;
  start_date: string;
  end_date: string | null;
  frequency_before: number;
  cost_per_use: number;
  time_per_use: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  session_id: string;
  check_in_date: string;
  mood: number | null;
  cravings_intensity: number | null;
  notes: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  session_id: string | null;
  entry_date: string;
  title: string | null;
  content: string | null;
  mood: number | null;
  triggers: string[] | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  days_required: number;
  icon: string | null;
  badge_url: string | null;
  is_custom: boolean;
  created_at: string;
}

export interface UserMilestone {
  id: string;
  user_id: string;
  session_id: string;
  milestone_id: string;
  achieved_at: string;
  shared: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_text: string;
  is_custom: boolean;
  priority: number | null;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  daily_reminder_time: string;
  weekly_summary: boolean;
  milestone_alerts: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
          id: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Habit, 'id' | 'user_id' | 'created_at'>>;
      };
      sobriety_sessions: {
        Row: SobrietySession;
        Insert: Omit<SobrietySession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SobrietySession, 'id' | 'user_id' | 'created_at'>>;
      };
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckIn, 'id' | 'user_id' | 'session_id' | 'created_at'>>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, 'id' | 'created_at'>;
        Update: Partial<Omit<Milestone, 'id' | 'created_at'>>;
      };
      user_milestones: {
        Row: UserMilestone;
        Insert: Omit<UserMilestone, 'id' | 'achieved_at'>;
        Update: Partial<Omit<UserMilestone, 'id' | 'user_id' | 'session_id' | 'milestone_id'>>;
      };
      goals: {
        Row: Goal;
        Insert: Omit<Goal, 'id' | 'created_at'>;
        Update: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>;
      };
      settings: {
        Row: Settings;
        Insert: Omit<Settings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Settings, 'id' | 'user_id' | 'created_at'>>;
      };
    };
  };
};
