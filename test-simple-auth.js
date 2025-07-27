import { createClient } from '@supabase/supabase-js'

// Usar as credenciais corretas da nova instância
const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTM1ODI4NzQsImV4cCI6MTc4NTExODg3NH0.skSRXYZ5iC5w1_iEuGM2z3aRg_kNHJf7nZ2_EBngg6o'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  try {
    console.log('🧪 Testando funcionalidades básicas do Supabase Auth...')
    
    // 1. Testar se consegue acessar a API do Auth
    console.log('\n1. Testando conexão com Auth API...')
    const { data: session } = await supabase.auth.getSession()
    console.log('✅ Auth API acessível. Sessão atual:', session.session ? 'Ativa' : 'Nenhuma')
    
    // 2. Testar registro de usuário
    console.log('\n2. Testando registro de usuário de teste...')
    const testEmail = `teste${Date.now()}@exemplo.com`
    const testPassword = '123456'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          nome_completo: 'Usuário Teste',
          tipo_usuario: 'cidadao'
        }
      }
    })
    
    if (signUpError) {
      console.error('❌ Erro no registro:', signUpError.message)
      
      // Se não consegue registrar, testar login com usuário existente
      console.log('\n3. Tentando login com credenciais de teste...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@teste.com',
        password: '123456'
      })
      
      if (signInError) {
        console.error('❌ Erro no login:', signInError.message)
      } else {
        console.log('✅ Login bem-sucedido!')
        console.log('User ID:', signInData.user?.id)
        console.log('Email:', signInData.user?.email)
      }
    } else {
      console.log('✅ Registro bem-sucedido!')
      console.log('User ID:', signUpData.user?.id)
      console.log('Email:', signUpData.user?.email)
      console.log('Confirmação necessária:', !signUpData.user?.email_confirmed_at)
    }
    
    // 4. Testar busca de dados
    console.log('\n4. Testando acesso aos dados...')
    const { data: secretarias, error: dataError } = await supabase
      .from('secretarias')
      .select('nome')
      .limit(3)
    
    if (dataError) {
      console.error('❌ Erro buscando dados:', dataError.message)
    } else {
      console.log('✅ Dados acessíveis:', secretarias.length, 'secretarias encontradas')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testAuth().catch(console.error)