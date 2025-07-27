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
  // Login do cidadão usando Supabase Auth nativo
  async signIn(email: string, password: string) {
    try {
      console.log('🔐 Iniciando login do cidadão com Supabase Auth...')
      
      // ETAPA 1: Autenticar com Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Erro na autenticação:', error)
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error('Dados de usuário não retornados')
      }

      console.log('✅ Autenticação Supabase bem-sucedida!')

      // ETAPA 2: Buscar perfil do cidadão
      const profile = await this.getCidadaoProfile(data.user.id)
      
      if (!profile) {
        // Fazer logout se perfil não encontrado
        await supabase.auth.signOut()
        throw new Error('Perfil de cidadão não encontrado')
      }

      // ETAPA 3: Salvar sessão do cidadão
      localStorage.setItem('cidadao_session', JSON.stringify({
        user: data.user,
        profile,
        timestamp: Date.now()
      }))

      console.log('✅ Login do cidadão completo!')
      return { user: data.user, profile }

    } catch (error: any) {
      console.error('❌ Erro no login do cidadão:', error)
      throw error
    }
  },

  // Registro público de cidadão usando Supabase Auth nativo
  async signUp(
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string, 
    telefone?: string
  ) {
    try {
      console.log('📝 Iniciando registro de cidadão...')
      
      // Verificar se CPF já está cadastrado
      const existingCitizen = await this.getCidadaoByCPF(cpf)
      if (existingCitizen) {
        throw new Error('CPF já cadastrado no sistema')
      }

      // Criar usuário no Supabase Auth
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
      
      if (error) {
        console.error('❌ Erro no registro:', error)
        throw error
      }

      console.log('✅ Usuário criado no Supabase Auth!')

      // O trigger handle_new_user() deve criar automaticamente os perfis
      // Mas vamos verificar se funcionou
      if (data.user && data.user.email_confirmed_at) {
        console.log('📧 Email confirmado automaticamente')
        
        // Aguardar um momento para o trigger processar
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar se o perfil foi criado
        const profile = await this.getCidadaoProfile(data.user.id)
        if (!profile) {
          console.log('⚠️ Perfil não foi criado pelo trigger, criando manualmente...')
          await this.createCidadaoProfile({
            id: data.user.id,
            email,
            nome_completo: nomeCompleto,
            cpf,
            telefone: telefone || null,
            status: 'ativo',
            primeiro_acesso: true
          })
        }
      }
      
      return data
      
    } catch (error: any) {
      console.error('❌ Erro no registro do cidadão:', error)
      throw error
    }
  },

  // Logout do cidadão
  async signOut() {
    localStorage.removeItem('cidadao_session')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('❌ Erro no logout:', error)
      throw error
    }
    console.log('🚪 Logout do cidadão realizado')
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