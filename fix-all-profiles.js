import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzU4Mjg3NCwiZXhwIjoxNzg1MTE4ODc0fQ.xV1xg7zrNy1WIVyBo3p4pyEkqV7vFGkfcXahFsH4-6g'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function fixAllProfiles() {
  try {
    console.log('🔧 Corrigindo perfis de todos os usuários...')
    
    // 1. Buscar todos os usuários do auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) {
      console.error('❌ Erro buscando usuários:', authError)
      return
    }
    
    console.log(`📋 Encontrados ${authUsers.users.length} usuários`)
    
    // 2. Buscar perfis de acesso disponíveis
    const { data: perfisAcesso } = await supabaseAdmin
      .from('perfis_acesso')
      .select('id, nome')
    
    const perfilMap = {}
    perfisAcesso.forEach(p => {
      perfilMap[p.nome] = p.id
    })
    
    console.log('📊 Perfis disponíveis:', Object.keys(perfilMap))
    
    // 3. Para cada usuário, verificar/criar perfil
    for (const user of authUsers.users) {
      console.log(`\n👤 Processando: ${user.email}`)
      
      // Verificar se já tem perfil
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (existingProfile) {
        console.log('   ✅ Perfil já existe')
        continue
      }
      
      // Determinar tipo de usuário e perfil
      const tipoUsuario = user.user_metadata?.tipo_usuario || 'cidadao'
      const nomeCompleto = user.user_metadata?.nome_completo || user.email
      
      let perfilNome = 'Cidadão'
      switch (tipoUsuario) {
        case 'super_admin':
          perfilNome = 'Super Administrador'
          break
        case 'admin':
          perfilNome = 'Administrador'
          break
        case 'secretario':
          perfilNome = 'Secretário Municipal'
          break
        case 'funcionario':
          perfilNome = 'Funcionário'
          break
        default:
          perfilNome = 'Cidadão'
      }
      
      const perfilId = perfilMap[perfilNome]
      if (!perfilId) {
        console.log(`   ❌ Perfil '${perfilNome}' não encontrado`)
        continue
      }
      
      // Criar perfil
      const { error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          nome_completo: nomeCompleto,
          tipo_usuario: tipoUsuario,
          perfil_acesso_id: perfilId,
          status: 'ativo',
          primeiro_acesso: true
        })
      
      if (createError) {
        console.log(`   ❌ Erro criando perfil:`, createError.message)
      } else {
        console.log(`   ✅ Perfil criado: ${perfilNome}`)
      }
    }
    
    // 4. Verificar resultado final
    console.log('\n📊 Verificando resultado:')
    const { data: allProfiles } = await supabaseAdmin
      .from('user_profiles')
      .select('email, nome_completo, tipo_usuario')
      .order('created_at', { ascending: false })
    
    allProfiles.forEach(profile => {
      console.log(`   ${profile.email} - ${profile.nome_completo} (${profile.tipo_usuario})`)
    })
    
    console.log('\n✅ Correção concluída!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

fixAllProfiles().catch(console.error)