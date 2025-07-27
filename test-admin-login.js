import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTM1ODI4NzQsImV4cCI6MTc4NTExODg3NH0.skSRXYZ5iC5w1_iEuGM2z3aRg_kNHJf7nZ2_EBngg6o'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminLogin() {
  try {
    console.log('🧪 Testando login admin como a aplicação faz...')
    
    // Simular exatamente o que o admin-auth.ts faz
    console.log('\n1. Fazendo login...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@cidade.gov.br',
      password: '123456'
    })
    
    if (error) {
      console.error('❌ Erro no login:', error.message)
      return
    }
    
    console.log('✅ Login realizado com sucesso')
    console.log('   User ID:', data.user.id)
    
    // Buscar perfil exatamente como a aplicação faz
    console.log('\n2. Buscando perfil...')
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) {
      console.error('❌ Erro buscando perfil:', profileError.message)
      return
    }
    
    console.log('✅ Perfil encontrado:')
    console.log('   ID:', profile.id)
    console.log('   Email:', profile.email)  
    console.log('   Nome:', profile.nome_completo)
    console.log('   Tipo:', profile.tipo_usuario)
    console.log('   Status:', profile.status)
    
    // Verificar se passaria na validação
    console.log('\n3. Verificando validação de acesso...')
    if (!profile || profile.tipo_usuario === 'cidadao') {
      console.log('❌ FALHARIA: Usuário seria rejeitado como cidadão')
      await supabase.auth.signOut()
    } else {
      console.log('✅ PASSARIA: Usuário é servidor público válido')
      console.log(`   Tipo '${profile.tipo_usuario}' != 'cidadao' ✓`)
    }
    
    // Testar também o cidadão para confirmar
    console.log('\n4. Testando usuário cidadão para comparar...')
    await supabase.auth.signOut()
    
    const { data: cidadaoData, error: cidadaoError } = await supabase.auth.signInWithPassword({
      email: 'cidadao@teste.com',
      password: '123456'
    })
    
    if (!cidadaoError && cidadaoData.user) {
      const { data: cidadaoProfile } = await supabase
        .from('user_profiles')
        .select('tipo_usuario')
        .eq('id', cidadaoData.user.id)
        .single()
      
      console.log(`   Cidadão tipo: '${cidadaoProfile?.tipo_usuario}'`)
      if (cidadaoProfile?.tipo_usuario === 'cidadao') {
        console.log('   ✅ Cidadão seria rejeitado corretamente')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testAdminLogin().catch(console.error)