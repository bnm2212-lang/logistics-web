import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const offlineError = {
  message: 'Supabase 설정을 사용할 수 없어 Mock Data로 전환합니다.',
};

function offlineResult() {
  return Promise.resolve({ data: null, error: offlineError });
}

function offlineMutation() {
  return {
    select: offlineResult,
    eq: offlineResult,
    in: offlineResult,
    then(resolve, reject) {
      return offlineResult().then(resolve, reject);
    },
  };
}

function createOfflineClient() {
  return {
    from() {
      return {
        select: offlineResult,
        insert: offlineMutation,
        update: offlineMutation,
        delete: offlineMutation,
      };
    },
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createOfflineClient();
