import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Transaction = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  occurred_at: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  budget_daily: number;
  budget_monthly: number;
  created_at: string;
};
