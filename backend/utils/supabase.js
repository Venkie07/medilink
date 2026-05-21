import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Service Role key for administrative operations

let supabase = null;

if (supabaseUrl && supabaseKey) {
  logger.info('Supabase storage client initialized successfully.');
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  logger.warn('Supabase credentials missing. Cloud uploads will fallback or be unavailable.');
}

export default supabase;
