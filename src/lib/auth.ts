import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  nome_completo: string
  tipo_usuario: 'super_admin' | 'admin' | 'secretario' | 'diretor' | 'coordenador' | 'funcionario' | 'atendente' | 'cidadao'
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

export const authService = {
  // Login
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      // Buscar perfil do usuário
      if (data.user) {
        try {
          const profile = await this.getUserProfile(data.user.id)
          return { user: data.user, profile }
        } catch (profileError) {
          console.warn('Erro ao buscar perfil, mas login ok:', profileError)
          return { user: data.user, profile: null }
        }
      }
      
      return { user: data.user, profile: null }
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Registro de cidadão (público)
  async signUpCitizen(email: string, password: string, nomeCompleto: string, cpf: string, telefone: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: nomeCompleto,
          cpf,
          telefone,
          tipo_usuario: 'cidadao'
        }
      }
    })
    
    if (error) throw error
    
    // Criar perfil do usuário
    if (data.user) {
      await this.createUserProfile({
        id: data.user.id,
        email,
        nome_completo: nomeCompleto,
        tipo_usuario: 'cidadao',
        status: 'ativo',
        primeiro_acesso: true
      })
    }
    
    return data
  },

  // Registro de servidor (apenas admin)
  async signUpServer(
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string,
    telefone: string,
    tipoUsuario: UserProfile['tipo_usuario'],
    secretariaId: string,
    cargo: string
  ) {
    // Verificar se usuário atual tem permissão
    const currentUser = await this.getCurrentUser()
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
      await this.createUserProfile({
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

  // Buscar perfil do usuário
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data
  },

  // Criar perfil do usuário
  async createUserProfile(profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar usuário atual
  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    return await this.getUserProfile(user.id)
  },

  // Buscar permissões do usuário
  async getUserPermissions(userId: string): Promise<Permissao[]> {
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

  // Verificar se usuário tem permissão específica
  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.some(p => p.codigo === permissionCode)
  },

  // Buscar secretarias (para formulário de registro)
  async getSecretarias(): Promise<Secretaria[]> {
    const { data, error } = await supabase
      .from('secretarias')
      .select('*')
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  // Listener para mudanças de autenticação
  onAuthStateChange(callback: (user: any, profile: UserProfile | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id)
        callback(session.user, profile)
      } else {
        callback(null, null)
      }
    })
  }
}