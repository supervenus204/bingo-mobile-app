import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://yedyccujvmjhetggkesg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZHljY3Vqdm1qaGV0Z2drZXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTYzMTksImV4cCI6MjA3MjMzMjMxOX0.FsVIysTZblqWGEqZGJ49uTyIf9sdXStOVaWEimbFdYI';
export const supabase = createClient(supabaseUrl, supabaseKey);
