import { createClient } from '@supabase/supabase-js';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const fallbackSupabaseUrl = 'https://jbqjyxxwbtacyynxmewd.supabase.co';
const fallbackSupabaseAnonKey = 'sb_publishable_LsNrZlw9UgSCa9NO-9AD6g_1gPephVR';

function cleanEnvValue(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return '';
  return trimmed;
}

const normalizedEnvUrl = cleanEnvValue(envSupabaseUrl);
const normalizedEnvAnonKey = cleanEnvValue(envSupabaseAnonKey);

const supabaseUrl = normalizedEnvUrl || fallbackSupabaseUrl;
const supabaseAnonKey = normalizedEnvAnonKey || fallbackSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);


const offlineError = {
  message: 'Supabase 설정을 사용할 수 없습니다.',
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
