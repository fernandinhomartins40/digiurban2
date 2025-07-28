// Script para debug da busca de usuários
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjxmkbnjnyogrmtcidil.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeG1rYm5qbnlvZ3JtdGNpZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMDA5NDMsImV4cCI6MjA1MzU3Njk0M30.PTavOOLCcw8-XR7qPNlJQb5Ygv5P-c2w0pOOQD37RN8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserFetch() {
  try {
    console.log('🔍 Testing user fetch...');

    // Test 1: Basic query
    console.log('\n1️⃣ Testing basic query...');
    const { data: users1, error: error1 } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);

    if (error1) {
      console.error('❌ Basic query error:', error1);
    } else {
      console.log('✅ Basic query success:', users1?.length, 'users');
      console.log('Sample user:', users1?.[0]);
    }

    // Test 2: Specific fields
    console.log('\n2️⃣ Testing specific fields...');
    const { data: users2, error: error2 } = await supabase
      .from('user_profiles')
      .select('id, nome_completo, email, tipo_usuario')
      .limit(5);

    if (error2) {
      console.error('❌ Specific fields error:', error2);
    } else {
      console.log('✅ Specific fields success:', users2?.length, 'users');
    }

    // Test 3: With additional fields
    console.log('\n3️⃣ Testing with additional fields...');
    const { data: users3, error: error3 } = await supabase
      .from('user_profiles')
      .select('id, nome_completo, email, tipo_usuario, secretaria, setor, cargo')
      .limit(5);

    if (error3) {
      console.error('❌ Additional fields error:', error3);
    } else {
      console.log('✅ Additional fields success:', users3?.length, 'users');
    }

    // Test 4: Check table structure
    console.log('\n4️⃣ Checking table structure...');
    const { data: columns, error: error4 } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' })
      .limit(1);

    if (error4) {
      console.log('⚠️ Cannot get columns (normal if function not exists)');
    } else {
      console.log('✅ Table columns:', columns);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testUserFetch();