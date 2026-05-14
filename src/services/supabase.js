import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://cswdflpavjtdqvrhlyrq.supabase.co";
const supabaseKey = "sb_publishable_1Yl9DhUFLoz1BkQN7f73hg_12Hq5rRu";

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase ;


