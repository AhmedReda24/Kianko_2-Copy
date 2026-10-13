import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

// لو المتغيرات مش متظبطة الموقع يفضل شغال بالبيانات المحلية (src/data/*)
export const supabase = url && key ? createClient(url, key) : null;
export const isSupabaseReady = Boolean(supabase);
