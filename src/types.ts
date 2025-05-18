// RoastMyVideo type definitions

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Voice options for TTS (Text-to-Speech)
export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

// A character/persona that will react to the video
export interface Persona {
  name: string;
  style?: string | null; // Speaking style or character traits
  constraints?: string | null; // Things this persona can't/won't talk about
  backstory?: string | null; // Background information about the persona
  voice_preference?: TTSVoice | null; // Preferred TTS voice
  tags?: string[] | null; // Tags for categorization/filtering
  id?: string; // Useful when fetched from DB
}

// A single line of dialogue in the commentary
export interface DialogueLine {
  speaker: string;
  text: string;
  timestamp?: number; // Optional timestamp in seconds
}

// Job data for video processing queue
export interface VideoJobData {
  // Required fields
  jobId: string;
  videoUrlInput: string;
  userPersonas: Persona[];
  
  // Optional fields
  transcriptSummary?: string | null;
  userGuidance?: string | null;
  speakingPace?: number;
  userId?: string | null;
  
  // Other fields that might be used elsewhere
  id?: string;
  videoUrl?: string;
  personas?: Persona[];
  callbackUrl?: string;
}

// A user's history entry for a generated video
export interface HistoryEntry {
  id: string;
  created_at: string;
  video_r2_url: string | null;
  thumbnail_url: string | null;
  source_video_url: string | null;
  num_speakers: number;
  personas: Persona[];
  transcript_summary: string | null;
  speaking_pace: number;
  job_id?: string | null;
  status?: 'queued' | 'processing' | 'completed' | 'failed' | string | null;
  error_message?: string | null;
  user_guidance?: string | null;
  user_id?: string | null;
  is_public?: boolean | null;
  updated_at?: string | null;
}

// Represents cached processed assets for a unique source video
export interface ProcessedVideoAsset {
  id: string; // UUID, Primary Key for this cache entry table
  source_video_identifier: string; // e.g., "youtube_VIDEOID"
  clipped_video_path_r2?: string | null; // R2 path for the ~60s source clip
  audio_transcript?: string | null;
  frame_paths_r2?: string[] | null; // Array of R2 paths for frame images
  frame_descriptions?: string | null;
  source_video_duration_seconds?: number | null;
  clip_duration_seconds?: number | null;
  processed_at: string; // ISO timestamp
  last_accessed_at: string; // ISO timestamp
}

// API Response formats
export interface DialogueResponse {
  dialogue: DialogueLine[];
  audioUrl?: string;
  videoUrl?: string;
  finalVideoUrl?: string;
  jobId?: string;
  error?: string;
  generatedSummary?: string;
}

export interface APIErrorResponse {
  error: string;
  details?: string;
  code?: string;
} 