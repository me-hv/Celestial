import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { env } from "../config/env";

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client instance or null if credentials are not configured
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseClient;
}
