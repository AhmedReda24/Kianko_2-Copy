import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohvjwenkocfragysvowp.supabase.co';
const supabaseKey = '=sb_publishable_8kVyThi4EE6FxRkclpaFVA_n83CVsK6'; // انسخ المفتاح الكامل الخاص بـ kianko_key بالضغط على زر النسخ بجوار المفتاح في الصفحة

export const supabase = createClient(supabaseUrl, supabaseKey);