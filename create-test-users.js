import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzU4Mjg3NCwiZXhwIjoxNzg1MTE4ODc0fQ.xV1xg7zrNy1WIVyBo3p4pyEkqV7vFGkfcXahFsH4-6g'

// Usar service role para criar usuários
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUsers() {
  console.log('👥 Criando usuários de teste...')
  
  const users = [
    {
      email: 'admin@cidade.gov.br',
      password: '123456',
      user_metadata: {
        nome_completo: 'Admin Sistema',
        tipo_usuario: 'super_admin'
      }
    },
    {
      email: 'secretario@saude.gov.br', 
      password: '123456',
      user_metadata: {
        nome_completo: 'Dr. João Secretário',
        tipo_usuario: 'secretario'
      }
    },
    {
      email: 'funcionario@educacao.gov.br',
      password: '123456', 
      user_metadata: {
        nome_completo: 'Maria Funcionária',
        tipo_usuario: 'funcionario'
      }
    },
    {
      email: 'cidadao@teste.com',
      password: '123456',
      user_metadata: {
        nome_completo: 'João Cidadão',
        tipo_usuario: 'cidadao'
      }
    }
  ]
  
  for (const userData of users) {
    try {
      console.log(`\n📝 Criando usuário: ${userData.email}`)
      
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: userData.user_metadata
      })
      
      if (error) {
        console.error(`❌ Erro criando ${userData.email}:`, error.message)
      } else {
        console.log(`✅ Usuário ${userData.email} criado com sucesso!`)
        console.log(`   ID: ${data.user.id}`)
        console.log(`   Tipo: ${userData.user_metadata.tipo_usuario}`)
      }
      
    } catch (err) {
      console.error(`❌ Erro geral criando ${userData.email}:`, err.message)
    }
  }
  
  // Verificar perfis criados
  console.log('\n📊 Verificando perfis criados...')
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('user_profiles')
      .select('email, nome_completo, tipo_usuario, status')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('❌ Erro buscando perfis:', error.message)
    } else {
      console.log('✅ Perfis encontrados:')
      profiles.forEach(profile => {
        console.log(`   ${profile.email} - ${profile.nome_completo} (${profile.tipo_usuario})`)
      })
    }
  } catch (err) {
    console.error('❌ Erro verificando perfis:', err.message)
  }
  
  console.log('\n🎯 Criação de usuários concluída!')
  console.log('\n📝 Credenciais de teste:')
  users.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.user_metadata.tipo_usuario})`)
  })
}

createTestUsers().catch(console.error)