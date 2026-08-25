import type { Database } from "@/integrations/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

// All database access in this app happens through trusted server functions.
// The tables are locked down at the RLS/grant level so browsers cannot touch
// them directly; server functions use the service-role client instead.
export function getServerSupabase(): SupabaseClient<Database> {
  const { supabaseAdmin } = require("@/integrations/supabase/client.server") as {
    supabaseAdmin: SupabaseClient<Database>;
  };
  return supabaseAdmin;
}
