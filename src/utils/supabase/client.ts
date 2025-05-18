import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types_db';

/**
 * Creates a Supabase client for browser environments
 */
export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
} 