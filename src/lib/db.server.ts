import { supabaseAdmin } from "@/integrations/supabase/client.server";

// All database access in this app happens through trusted server functions.
// The tables are locked down at the RLS/grant level so browsers cannot touch
// them directly; server functions use the service-role client instead.
export function getServerSupabase() {
  return supabaseAdmin;
}
