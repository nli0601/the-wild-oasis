import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  "https://ycckpclbgmmefvuzqolp.supabase.co";
const supabaseKey =
  "sb_publishable_BzZKvp7s_V2ovchFTTgLsQ_8duYy8V_";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
