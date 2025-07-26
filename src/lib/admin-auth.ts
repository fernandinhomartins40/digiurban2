import { supabase } from './supabase'

export interface AdminUser {
  id: string
  email: string
  nome_completo: string
  tipo_usuario: 'super_admin' | 'admin' | 'secretario' | 'diretor' | 'coordenador' | 'funcionario' | 'atendente'
  perfil_acesso_id: string | null
  secretaria_id: string | null
  setor_id: string | null
  cargo: string | null
  status: 'ativo' | 'inativo' | 'suspenso'
  primeiro_acesso: boolean
  created_at: string
  updated_at: string
}

export interface Secretaria {
  id: string
  codigo: string
  nome: string
  sigla: string
  descricao: string
}

export interface Permissao {
  codigo: string
  nome: string
  descricao: string
  modulo_id: string
  recurso: string
  acao: string
}

export const adminAuthService = {
  // Login administrativo
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Verificar se é usuário administrativo
    if (data.user) {
      const profile = await this.getAdminProfile(data.user.id)
      if (!profile || profile.tipo_usuario === 'cidadao') {
        await supabase.auth.signOut()
        throw new Error('Acesso negado. Este portal é exclusivo para servidores públicos.')
      }
      
      // Salvar sessão administrativa
      localStorage.setItem('admin_session', JSON.stringify({
        user: data.user,
        profile,
        timestamp: Date.now()
      }))
      
      return { user: data.user, profile }
    }
    
    return { user: data.user, profile: null }
  },

  // Logout administrativo
  async signOut() {
    localStorage.removeItem('admin_session')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Registro de servidor (apenas admin)
  async createServer(
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string,
    telefone: string,
    tipoUsuario: AdminUser['tipo_usuario'],
    secretariaId: string,
    cargo: string
  ) {
    // Verificar se usuário atual tem permissão
    const currentUser = await this.getCurrentAdmin()
    if (!currentUser || !['super_admin', 'admin'].includes(currentUser.tipo_usuario)) {
      throw new Error('Sem permissão para criar usuários do servidor')
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nome_completo: nomeCompleto,
        cpf,
        telefone,
        tipo_usuario: tipoUsuario
      }
    })
    
    if (error) throw error
    
    // Criar perfil do usuário
    if (data.user) {
      await this.createAdminProfile({
        id: data.user.id,
        email,
        nome_completo: nomeCompleto,
        tipo_usuario: tipoUsuario,
        secretaria_id: secretariaId,
        cargo,
        status: 'ativo',
        primeiro_acesso: true
      })
    }
    
    return data
  },

  // Buscar perfil administrativo
  async getAdminProfile(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .neq('tipo_usuario', 'cidadao')
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data
  },

  // Criar perfil administrativo
  async createAdminProfile(profile: Partial<AdminUser>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar usuário administrativo atual
  async getCurrentAdmin(): Promise<AdminUser | null> {
    // Verificar sessão local primeiro
    const session = localStorage.getItem('admin_session')
    if (session) {
      const parsedSession = JSON.parse(session)
      // Verificar se sessão não expirou (24 horas)
      if (Date.now() - parsedSession.timestamp < 24 * 60 * 60 * 1000) {
        return parsedSession.profile
      } else {
        localStorage.removeItem('admin_session')
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    return await this.getAdminProfile(user.id)
  },

  // Buscar permissões do usuário administrativo
  async getAdminPermissions(userId: string): Promise<Permissao[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        perfil_acesso_id,
        perfis_acesso!inner(
          perfil_permissoes!inner(
            permissoes!inner(*)
          )
        )
      `)
      .eq('id', userId)
      .neq('tipo_usuario', 'cidadao')
      .single()
    
    if (error) throw error
    
    // Extrair permissões
    const permissoes: Permissao[] = []
    if (data?.perfis_acesso?.perfil_permissoes) {
      data.perfis_acesso.perfil_permissoes.forEach((pp: any) => {
        if (pp.concedida && pp.permissoes) {
          permissoes.push(pp.permissoes)
        }
      })
    }
    
    return permissoes
  },

  // Verificar se usuário administrativo tem permissão específica
  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    const permissions = await this.getAdminPermissions(userId)
    return permissions.some(p => p.codigo === permissionCode)
  },

  // Buscar secretarias
  async getSecretarias(): Promise<Secretaria[]> {
    const { data, error } = await supabase
      .from('secretarias')
      .select('*')
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  // Verificar se usuário é admin
  isAdmin(user: AdminUser | null): boolean {
    return user?.tipo_usuario === 'super_admin' || user?.tipo_usuario === 'admin'
  },

  // Verificar se usuário é super admin
  isSuperAdmin(user: AdminUser | null): boolean {
    return user?.tipo_usuario === 'super_admin'
  },

  // Listener para mudanças de autenticação administrativa
  onAuthStateChange(callback: (user: any, profile: AdminUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getAdminProfile(session.user.id)
        if (profile) {
          // Atualizar sessão local
          localStorage.setItem('admin_session', JSON.stringify({
            user: session.user,
            profile,
            timestamp: Date.now()
          }))
        }
        callback(session.user, profile)
      } else {
        localStorage.removeItem('admin_session')
        callback(null, null)
      }
    })
  }
}