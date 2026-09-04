import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { env } from "../config/env";

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Returns a typed Supabase client instance or null if credentials are not configured.
 * Safely handles missing optional database credentials without throwing runtime errors.
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

  try {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    return supabaseClient;
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase client with provided credentials:", err);
    return null;
  }
}
