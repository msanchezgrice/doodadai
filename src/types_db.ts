export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      custom_personas: {
        Row: {
          backstory: string | null
          constraints: string | null
          created_at: string
          id: string
          name: string
          style: string | null
          tags: string[] | null
          user_id: string | null
          voice_preference: string | null
        }
        Insert: {
          backstory?: string | null
          constraints?: string | null
          created_at?: string
          id?: string
          name: string
          style?: string | null
          tags?: string[] | null
          user_id?: string | null
          voice_preference?: string | null
        }
        Update: {
          backstory?: string | null
          constraints?: string | null
          created_at?: string
          id?: string
          name?: string
          style?: string | null
          tags?: string[] | null
          user_id?: string | null
          voice_preference?: string | null
        }
        Relationships: []
      }
      processed_video_assets: {
        Row: {
          audio_transcript: string | null
          clip_duration_seconds: number | null
          clipped_video_path_r2: string | null
          frame_descriptions: string | null
          frame_paths_r2: Json | null
          id: string
          last_accessed_at: string | null
          processed_at: string | null
          source_video_duration_seconds: number | null
          source_video_identifier: string
        }
        Insert: {
          audio_transcript?: string | null
          clip_duration_seconds?: number | null
          clipped_video_path_r2?: string | null
          frame_descriptions?: string | null
          frame_paths_r2?: Json | null
          id?: string
          last_accessed_at?: string | null
          processed_at?: string | null
          source_video_duration_seconds?: number | null
          source_video_identifier: string
        }
        Update: {
          audio_transcript?: string | null
          clip_duration_seconds?: number | null
          clipped_video_path_r2?: string | null
          frame_descriptions?: string | null
          frame_paths_r2?: Json | null
          id?: string
          last_accessed_at?: string | null
          processed_at?: string | null
          source_video_duration_seconds?: number | null
          source_video_identifier?: string
        }
        Relationships: []
      }
      video_history: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          is_public: boolean | null
          job_id: string | null
          num_speakers: number | null
          personas: Json | null
          source_video_url: string | null
          speaking_pace: number | null
          status: string | null
          thumbnail_url: string | null
          transcript_summary: string | null
          updated_at: string | null
          user_guidance: string | null
          user_id: string | null
          video_r2_url: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          is_public?: boolean | null
          job_id?: string | null
          num_speakers?: number | null
          personas?: Json | null
          source_video_url?: string | null
          speaking_pace?: number | null
          status?: string | null
          thumbnail_url?: string | null
          transcript_summary?: string | null
          updated_at?: string | null
          user_guidance?: string | null
          user_id?: string | null
          video_r2_url?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          is_public?: boolean | null
          job_id?: string | null
          num_speakers?: number | null
          personas?: Json | null
          source_video_url?: string | null
          speaking_pace?: number | null
          status?: string | null
          thumbnail_url?: string | null
          transcript_summary?: string | null
          updated_at?: string | null
          user_guidance?: string | null
          user_id?: string | null
          video_r2_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 