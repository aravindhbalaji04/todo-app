import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfbcbiszwutbscivecza.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYmNiaXN6d3V0YnNjaXZlY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTQ0NDIsImV4cCI6MjA2MzMzMDQ0Mn0.c3KIgEA2GkWda1jwLNuizZIMenAjE8wH-BFSATuBnXg'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);