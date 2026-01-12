import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key) => {
        return new Promise((resolve) => {
          chrome.storage.local.get([key], (result) => {
            resolve(result[key] || null);
          });
        });
      },
      setItem: (key, value) => {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, () => {
            resolve();
          });
        });
      },
      removeItem: (key) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove([key], () => {
            resolve();
          });
        });
      },
    },
  },
});
