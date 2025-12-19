const SUPABASE_URL = 'https://elwvacgobxqhzjtzgyli.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6DEysRRiOKtD3UB27O3jaw_uHH8Ivxr';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase inicializado:', SUPABASE_URL);
