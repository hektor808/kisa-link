import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerinden Supabase URL ve anon anahtarını alıyoruz.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase istemcisini oluşturup dışa aktarıyoruz.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);