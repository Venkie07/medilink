import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Service Role key for administrative operations

if (!supabaseUrl || !supabaseKey) {
  logger.error('CRITICAL: SUPABASE_URL or SUPABASE_KEY environment variables are missing.');
  throw new Error('Supabase client initialization failed: SUPABASE_URL and SUPABASE_KEY are required.');
}

logger.info('Supabase storage client initialized successfully.');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export default supabase;
