import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzU4Mjg3NCwiZXhwIjoxNzg1MTE4ODc0fQ.xV1xg7zrNy1WIVyBo3p4pyEkqV7vFGkfcXahFsH4-6g'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function debugAdminUser() {
  try {
    console.log('🔍 Debugando usuário admin...')
    
    // 1. Buscar usuário admin@cidade.gov.br no auth.users
    console.log('\n1. Verificando auth.users:')
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro buscando auth.users:', authError)
      return
    }
    
    const adminUser = authUsers.users.find(u => u.email === 'admin@cidade.gov.br')
    if (!adminUser) {
      console.log('❌ Usuário admin@cidade.gov.br não encontrado em auth.users')
      return
    }
    
    console.log('✅ Usuário encontrado em auth.users:')
    console.log('   ID:', adminUser.id)
    console.log('   Email:', adminUser.email)
    console.log('   Metadata:', JSON.stringify(adminUser.user_metadata, null, 2))
    
    // 2. Buscar perfil correspondente em user_profiles
    console.log('\n2. Verificando user_profiles:')
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single()
    
    if (profileError) {
      console.error('❌ Erro buscando profile:', profileError)
      console.log('🔧 Vou tentar criar o perfil manualmente...')
      
      // Tentar criar perfil manualmente
      const { data: perfilAcesso } = await supabaseAdmin
        .from('perfis_acesso')
        .select('id')
        .eq('nome', 'Super Administrador')
        .single()
      
      if (perfilAcesso) {
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            id: adminUser.id,
            email: adminUser.email,
            nome_completo: adminUser.user_metadata?.nome_completo || 'Admin Sistema',
            tipo_usuario: 'super_admin',
            perfil_acesso_id: perfilAcesso.id,
            status: 'ativo',
            primeiro_acesso: true
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Erro criando perfil:', createError)
        } else {
          console.log('✅ Perfil criado:', newProfile)
        }
      }
      
    } else {
      console.log('✅ Perfil encontrado:')
      console.log('   ID:', profile.id)
      console.log('   Email:', profile.email)
      console.log('   Nome:', profile.nome_completo)
      console.log('   Tipo:', profile.tipo_usuario)
      console.log('   Status:', profile.status)
      console.log('   Perfil Acesso ID:', profile.perfil_acesso_id)
    }
    
    // 3. Testar login
    console.log('\n3. Testando login admin:')
    const { data: loginData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
      email: 'admin@cidade.gov.br',
      password: '123456'
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError)
    } else {
      console.log('✅ Login bem-sucedido!')
      
      // Buscar perfil após login
      const { data: profileAfterLogin } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', loginData.user.id)
        .single()
      
      console.log('📊 Perfil após login:', profileAfterLogin)
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

debugAdminUser().catch(console.error)