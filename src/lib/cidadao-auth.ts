import { supabase } from './supabase'

export interface CidadaoUser {
  id: string
  email: string
  nome_completo: string
  cpf: string
  telefone: string | null
  endereco: string | null
  data_nascimento: string | null
  status: 'ativo' | 'inativo' | 'suspenso'
  primeiro_acesso: boolean
  created_at: string
  updated_at: string
}

export interface Protocolo {
  id: string
  numero: string
  assunto: string
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'cancelado'
  data_abertura: string
  data_atualizacao: string
  cidadao_id: string
  secretaria_id: string
  observacoes: string | null
}

export interface ServicoPublico {
  id: string
  codigo: string
  nome: string
  descricao: string
  categoria: string
  secretaria_id: string
  ativo: boolean
  online: boolean
  documentos_necessarios: string[]
  prazo_dias: number | null
}

export const cidadaoAuthService = {
  // Login do cidadão
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Verificar se é usuário cidadão
    if (data.user) {
      const profile = await this.getCidadaoProfile(data.user.id)
      if (!profile) {
        await supabase.auth.signOut()
        throw new Error('Acesso negado. Perfil de cidadão não encontrado.')
      }
      
      // Salvar sessão do cidadão
      localStorage.setItem('cidadao_session', JSON.stringify({
        user: data.user,
        profile,
        timestamp: Date.now()
      }))
      
      return { user: data.user, profile }
    }
    
    return { user: data.user, profile: null }
  },

  // Registro público de cidadão
  async signUp(
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string, 
    telefone?: string
  ) {
    // Verificar se CPF já está cadastrado
    const existingCitizen = await this.getCidadaoByCPF(cpf)
    if (existingCitizen) {
      throw new Error('CPF já cadastrado no sistema')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: nomeCompleto,
          cpf,
          telefone: telefone || null,
          tipo_usuario: 'cidadao'
        }
      }
    })
    
    if (error) throw error
    
    // Criar perfil do cidadão
    if (data.user) {
      await this.createCidadaoProfile({
        id: data.user.id,
        email,
        nome_completo: nomeCompleto,
        cpf,
        telefone: telefone || null,
        status: 'ativo',
        primeiro_acesso: true
      })
      
      // Criar também um registro básico em user_profiles para compatibilidade
      await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          email,
          nome_completo: nomeCompleto,
          tipo_usuario: 'cidadao',
          status: 'ativo',
          primeiro_acesso: true
        }])
    }
    
    return data
  },

  // Logout do cidadão
  async signOut() {
    localStorage.removeItem('cidadao_session')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Buscar perfil do cidadão
  async getCidadaoProfile(userId: string): Promise<CidadaoUser | null> {
    const { data, error } = await supabase
      .from('cidadao_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data
  },

  // Buscar cidadão por CPF
  async getCidadaoByCPF(cpf: string): Promise<CidadaoUser | null> {
    const { data, error } = await supabase
      .from('cidadao_profiles')
      .select('*')
      .eq('cpf', cpf)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    
    return data
  },

  // Criar perfil do cidadão
  async createCidadaoProfile(profile: Partial<CidadaoUser>) {
    const { data, error } = await supabase
      .from('cidadao_profiles')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar perfil do cidadão
  async updateCidadaoProfile(userId: string, updates: Partial<CidadaoUser>) {
    const { data, error } = await supabase
      .from('cidadao_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar cidadão atual
  async getCurrentCidadao(): Promise<CidadaoUser | null> {
    // Verificar sessão local primeiro
    const session = localStorage.getItem('cidadao_session')
    if (session) {
      const parsedSession = JSON.parse(session)
      // Verificar se sessão não expirou (24 horas)
      if (Date.now() - parsedSession.timestamp < 24 * 60 * 60 * 1000) {
        return parsedSession.profile
      } else {
        localStorage.removeItem('cidadao_session')
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    return await this.getCidadaoProfile(user.id)
  },

  // Buscar protocolos do cidadão
  async getProtocolos(cidadaoId: string): Promise<Protocolo[]> {
    const { data, error } = await supabase
      .from('protocolos')
      .select(`
        *,
        secretarias(nome, sigla)
      `)
      .eq('cidadao_id', cidadaoId)
      .order('data_abertura', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Criar novo protocolo
  async createProtocolo(
    cidadaoId: string,
    assunto: string,
    descricao: string,
    secretariaId: string,
    servicoId?: string
  ): Promise<Protocolo> {
    // Gerar número do protocolo
    const ano = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    const numero = `${ano}${timestamp}`

    const { data, error } = await supabase
      .from('protocolos')
      .insert([{
        numero,
        assunto,
        descricao,
        cidadao_id: cidadaoId,
        secretaria_id: secretariaId,
        servico_id: servicoId,
        status: 'aberto',
        data_abertura: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Buscar serviços públicos disponíveis
  async getServicosPublicos(): Promise<ServicoPublico[]> {
    const { data, error } = await supabase
      .from('servicos_publicos')
      .select(`
        *,
        secretarias(nome, sigla)
      `)
      .eq('ativo', true)
      .eq('online', true)
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  // Buscar serviços por categoria
  async getServicosPorCategoria(categoria: string): Promise<ServicoPublico[]> {
    const { data, error } = await supabase
      .from('servicos_publicos')
      .select(`
        *,
        secretarias(nome, sigla)
      `)
      .eq('categoria', categoria)
      .eq('ativo', true)
      .eq('online', true)
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  // Recuperar senha
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cidadao/auth/reset-password`
    })
    
    if (error) throw error
  },

  // Atualizar senha
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  // Verificar disponibilidade de email
  async isEmailAvailable(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('cidadao_profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    return !data
  },

  // Listener para mudanças de autenticação do cidadão
  onAuthStateChange(callback: (user: any, profile: CidadaoUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getCidadaoProfile(session.user.id)
        if (profile) {
          // Atualizar sessão local
          localStorage.setItem('cidadao_session', JSON.stringify({
            user: session.user,
            profile,
            timestamp: Date.now()
          }))
        }
        callback(session.user, profile)
      } else {
        localStorage.removeItem('cidadao_session')
        callback(null, null)
      }
    })
  }
}