import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zbhwlvusbtjsitwucayc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dKXS84lH_eBADQsNVtw_GA_7vhbvx8i';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
