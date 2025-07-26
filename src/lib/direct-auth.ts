// =====================================================
// direct-auth.ts
// SOLUÇÃO DIRETA SEM RPC - CONSULTAS SQL DIRETAS
// =====================================================

import { supabase } from './supabase'

export interface DirectUser {
  id: string
  email: string
  role: string
}

export interface DirectProfile {
  id: string
  email: string
  nome_completo: string
  tipo_usuario: 'super_admin' | 'admin' | 'secretario' | 'diretor' | 'coordenador' | 'funcionario' | 'atendente' | 'cidadao'
  perfil_acesso_id: string
  secretaria_id: string | null
  cargo: string | null
  status: 'ativo' | 'inativo' | 'suspenso'
  cpf: string | null
  telefone: string | null
}

export interface DirectLoginResponse {
  success: boolean
  error: string | null
  user: DirectUser | null
  profile: DirectProfile | null
}

export class DirectAuthService {
  private user: DirectUser | null = null
  private profile: DirectProfile | null = null
  private permissions: any[] = []

  // =====================================================
  // LOGIN DIRETO COM CONSULTAS SQL
  // =====================================================
  
  async signIn(email: string, password: string): Promise<DirectLoginResponse> {
    try {
      console.log('🔐 Tentando login direto para:', email)
      
      // ETAPA 1: Verificar credenciais na tabela temporária
      const { data: credentialData, error: credentialError } = await supabase
        .from('temp_credentials')
        .select('email, password')
        .eq('email', email)
        .single()

      if (credentialError || !credentialData) {
        console.error('❌ Email não encontrado:', credentialError)
        return {
          success: false,
          error: 'Email não encontrado',
          user: null,
          profile: null
        }
      }

      // ETAPA 2: Verificar senha
      if (credentialData.password !== password) {
        console.log('❌ Senha incorreta')
        return {
          success: false,
          error: 'Senha incorreta',
          user: null,
          profile: null
        }
      }

      console.log('✅ Credenciais válidas!')

      // ETAPA 3: Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          nome_completo,
          tipo_usuario,
          perfil_acesso_id,
          secretaria_id,
          cargo,
          status,
          cpf,
          telefone
        `)
        .eq('email', email)
        .single()

      if (profileError || !profileData) {
        console.error('❌ Perfil não encontrado:', profileError)
        return {
          success: false,
          error: 'Perfil não encontrado',
          user: null,
          profile: null
        }
      }

      console.log('✅ Perfil encontrado:', profileData.nome_completo)

      // ETAPA 4: Criar objetos de resposta
      const user: DirectUser = {
        id: profileData.id,
        email: profileData.email,
        role: 'authenticated'
      }

      const profile: DirectProfile = {
        id: profileData.id,
        email: profileData.email,
        nome_completo: profileData.nome_completo,
        tipo_usuario: profileData.tipo_usuario,
        perfil_acesso_id: profileData.perfil_acesso_id,
        secretaria_id: profileData.secretaria_id,
        cargo: profileData.cargo,
        status: profileData.status,
        cpf: profileData.cpf,
        telefone: profileData.telefone
      }

      // ETAPA 5: Armazenar localmente
      this.user = user
      this.profile = profile

      // ETAPA 6: Buscar permissões
      await this.loadUserPermissions(profile.perfil_acesso_id)

      // ETAPA 7: Salvar no localStorage
      localStorage.setItem('direct_auth_user', JSON.stringify(user))
      localStorage.setItem('direct_auth_profile', JSON.stringify(profile))
      localStorage.setItem('direct_auth_permissions', JSON.stringify(this.permissions))

      console.log('✅ Login direto bem-sucedido!')

      return {
        success: true,
        error: null,
        user,
        profile
      }

    } catch (error: any) {
      console.error('❌ Erro no login direto:', error)
      return {
        success: false,
        error: error.message || 'Erro interno no login',
        user: null,
        profile: null
      }
    }
  }

  // =====================================================
  // CARREGAR PERMISSÕES DIRETAMENTE
  // =====================================================
  
  private async loadUserPermissions(perfilAcessoId: string) {
    try {
      const { data, error } = await supabase
        .from('perfil_permissoes')
        .select(`
          permissao_id,
          concedida,
          permissoes (
            id,
            codigo,
            nome,
            descricao,
            modulo
          )
        `)
        .eq('perfil_id', perfilAcessoId)
        .eq('concedida', true)

      if (error) {
        console.error('❌ Erro ao carregar permissões:', error)
        return
      }

      this.permissions = data?.map(item => ({
        id: item.permissoes?.id,
        codigo: item.permissoes?.codigo,
        nome: item.permissoes?.nome,
        descricao: item.permissoes?.descricao,
        modulo: item.permissoes?.modulo,
        concedida: item.concedida
      })) || []

      console.log('📋 Permissões carregadas:', this.permissions.length)
      
    } catch (error) {
      console.error('❌ Erro ao carregar permissões:', error)
      this.permissions = []
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================
  
  async signOut() {
    this.user = null
    this.profile = null
    this.permissions = []

    localStorage.removeItem('direct_auth_user')
    localStorage.removeItem('direct_auth_profile')
    localStorage.removeItem('direct_auth_permissions')

    console.log('🚪 Logout direto realizado')
  }

  // =====================================================
  // RESTAURAR SESSÃO
  // =====================================================
  
  restoreSession() {
    try {
      const storedUser = localStorage.getItem('direct_auth_user')
      const storedProfile = localStorage.getItem('direct_auth_profile')
      const storedPermissions = localStorage.getItem('direct_auth_permissions')

      if (storedUser && storedProfile) {
        this.user = JSON.parse(storedUser)
        this.profile = JSON.parse(storedProfile)
        this.permissions = storedPermissions ? JSON.parse(storedPermissions) : []

        console.log('🔄 Sessão direta restaurada:', this.profile?.nome_completo)
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Erro ao restaurar sessão direta:', error)
      return false
    }
  }

  // =====================================================
  // GETTERS
  // =====================================================
  
  getUser(): DirectUser | null {
    return this.user
  }

  getProfile(): DirectProfile | null {
    return this.profile
  }

  getPermissions(): any[] {
    return this.permissions
  }

  // =====================================================
  // VERIFICAÇÕES DE PERMISSÃO
  // =====================================================
  
  hasPermission(permissionCode: string): boolean {
    return this.permissions.some(p => p.codigo === permissionCode && p.concedida)
  }

  isAdmin(): boolean {
    return this.profile?.tipo_usuario === 'super_admin' || this.profile?.tipo_usuario === 'admin'
  }

  isSuperAdmin(): boolean {
    return this.profile?.tipo_usuario === 'super_admin'
  }

  isCitizen(): boolean {
    return this.profile?.tipo_usuario === 'cidadao'
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.profile !== null
  }

  getUserType(): string | null {
    return this.profile?.tipo_usuario || null
  }
}

// Instância singleton
export const directAuth = new DirectAuthService()

// Restaurar sessão ao carregar
if (typeof window !== 'undefined') {
  directAuth.restoreSession()
}