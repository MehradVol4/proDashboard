import { createClient } from '@supabase/supabase-js';

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://cswdflpavjtdqvrhlyrq.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_1Yl9DhUFLoz1BkQN7f73hg_12Hq5rRu";

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase ;


