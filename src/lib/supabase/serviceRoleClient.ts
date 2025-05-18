import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types_db';

/**
 * Supabase client with admin privileges
 * This should only be used in server-side code
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 