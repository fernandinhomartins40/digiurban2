import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://82.25.69.57:8115'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTM1NjQzMTMsImV4cCI6MTc4NTEwMDMxM30.X_8ha-4fBr-vT6mC5HSVvtOb9AX1EHN1MnmACiiOB6w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)