import "server-only";

import { createClient } from "@supabase/supabase-js";

// These are public project identifiers, not privileged database credentials.
// Environment variables still take priority so the deployment can be moved to
// another Supabase project without changing application code.
const defaultSupabaseUrl = "https://dujdlwnqpenlbxbxysha.supabase.co";
const defaultSupabasePublishableKey = "sb_publishable_eO1f75nfzn9-Y7SgKEhSIw_mUXRLHXo";

export function createSupabaseServerClient() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    defaultSupabaseUrl;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    defaultSupabasePublishableKey;

  return createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
