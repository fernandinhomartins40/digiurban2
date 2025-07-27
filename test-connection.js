import { createClient } from '@supabase/supabase-js'

// Usar as novas credenciais
const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTM1ODI4NzQsImV4cCI6MTc4NTExODg3NH0.skSRXYZ5iC5w1_iEuGM2z3aRg_kNHJf7nZ2_EBngg6o'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🧪 Testando conexão com Supabase...')
    
    // Testar se consegue buscar secretarias
    console.log('\n📋 Testando busca de secretarias:')
    const { data: secretarias, error: secretariasError } = await supabase
      .from('secretarias')
      .select('codigo, nome')
      .limit(5)
    
    if (secretariasError) {
      console.error('❌ Erro buscando secretarias:', secretariasError)
    } else {
      console.log('✅ Secretarias encontradas:', secretarias.length)
      secretarias.forEach(s => console.log(`   ${s.codigo}: ${s.nome}`))
    }
    
    // Testar se consegue buscar perfis de acesso
    console.log('\n👥 Testando busca de perfis:')
    const { data: perfis, error: perfisError } = await supabase
      .from('perfis_acesso')
      .select('nome, nivel_acesso')
    
    if (perfisError) {
      console.error('❌ Erro buscando perfis:', perfisError)
    } else {
      console.log('✅ Perfis encontrados:', perfis.length)
      perfis.forEach(p => console.log(`   ${p.nome} (nível ${p.nivel_acesso})`))
    }
    
    // Testar se consegue buscar permissões
    console.log('\n🔐 Testando busca de permissões:')
    const { data: permissoes, error: permissoesError } = await supabase
      .from('permissoes')
      .select('codigo, nome, modulo')
      .limit(10)
    
    if (permissoesError) {
      console.error('❌ Erro buscando permissões:', permissoesError)
    } else {
      console.log('✅ Permissões encontradas:', permissoes.length)
      permissoes.forEach(p => console.log(`   ${p.codigo}: ${p.nome} (${p.modulo})`))
    }
    
    console.log('\n🎉 Teste de conexão concluído!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testConnection().catch(console.error)