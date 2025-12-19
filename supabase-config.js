const SUPABASE_URL = 'https://elwvacgobxqhzjtzgyli.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6DEysRRiOKtD3UB27O3jaw_uHH8Ivxr';

let supabaseClient;

(function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase CDN não carregou! Aguardando...');
        setTimeout(initSupabase, 100);
        return;
    }
    
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado:', SUPABASE_URL);
})();
