// =====================================================
// custom-auth.ts
// SOLUÇÃO ALTERNATIVA PARA LOGIN SEM GOTRUE
// =====================================================

import { supabase } from './supabase'

export interface CustomUser {
  id: string
  email: string
  role: string
  email_confirmed_at: string | null
}

export interface CustomProfile {
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

export interface CustomPermission {
  id: string
  codigo: string
  nome: string
  descricao: string
  modulo: string
  concedida: boolean
}

export interface CustomSecretaria {
  id: string
  codigo: string
  nome: string
  descricao: string
  responsavel_id: string | null
}

export interface CustomLoginResponse {
  success: boolean
  error: string | null
  user: CustomUser | null
  profile: CustomProfile | null
}

export class CustomAuthService {
  private user: CustomUser | null = null
  private profile: CustomProfile | null = null
  private permissions: CustomPermission[] = []
  private secretaria: CustomSecretaria | null = null

  // =====================================================
  // LOGIN CUSTOMIZADO
  // =====================================================
  
  async signIn(email: string, password: string): Promise<CustomLoginResponse> {
    try {
      console.log('🔐 Tentando login customizado para:', email)
      
      // Chamar função SQL customizada
      const { data, error } = await supabase.rpc('custom_login', {
        user_email: email,
        user_password: password
      })

      if (error) {
        console.error('❌ Erro na função custom_login:', error)
        throw new Error(error.message)
      }

      console.log('📋 Resposta da função custom_login:', data)

      const response = data as CustomLoginResponse

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Erro desconhecido no login',
          user: null,
          profile: null
        }
      }

      // Armazenar dados localmente
      this.user = response.user
      this.profile = response.profile

      // Buscar permissões se tiver perfil
      if (this.profile?.id) {
        await this.loadUserPermissions(this.profile.id)
      }

      // Buscar secretaria se tiver
      if (this.profile?.secretaria_id) {
        await this.loadUserSecretaria(this.profile.secretaria_id)
      }

      // Salvar no localStorage para persistência
      localStorage.setItem('custom_auth_user', JSON.stringify(this.user))
      localStorage.setItem('custom_auth_profile', JSON.stringify(this.profile))
      localStorage.setItem('custom_auth_permissions', JSON.stringify(this.permissions))
      localStorage.setItem('custom_auth_secretaria', JSON.stringify(this.secretaria))

      console.log('✅ Login customizado bem-sucedido!')
      
      return response

    } catch (error: any) {
      console.error('❌ Erro no login customizado:', error)
      return {
        success: false,
        error: error.message || 'Erro interno no login',
        user: null,
        profile: null
      }
    }
  }

  // =====================================================
  // CARREGAR PERMISSÕES
  // =====================================================
  
  private async loadUserPermissions(profileId: string) {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        user_profile_id: profileId
      })

      if (error) {
        console.error('❌ Erro ao carregar permissões:', error)
        return
      }

      this.permissions = data || []
      console.log('📋 Permissões carregadas:', this.permissions.length)
      
    } catch (error) {
      console.error('❌ Erro ao carregar permissões:', error)
    }
  }

  // =====================================================
  // CARREGAR SECRETARIA
  // =====================================================
  
  private async loadUserSecretaria(secretariaId: string) {
    try {
      const { data, error } = await supabase.rpc('get_user_secretaria', {
        secretaria_id: secretariaId
      })

      if (error) {
        console.error('❌ Erro ao carregar secretaria:', error)
        return
      }

      this.secretaria = data
      console.log('🏢 Secretaria carregada:', this.secretaria?.nome)
      
    } catch (error) {
      console.error('❌ Erro ao carregar secretaria:', error)
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================
  
  async signOut() {
    this.user = null
    this.profile = null
    this.permissions = []
    this.secretaria = null

    // Limpar localStorage
    localStorage.removeItem('custom_auth_user')
    localStorage.removeItem('custom_auth_profile')
    localStorage.removeItem('custom_auth_permissions')
    localStorage.removeItem('custom_auth_secretaria')

    console.log('🚪 Logout realizado')
  }

  // =====================================================
  // RESTAURAR SESSÃO
  // =====================================================
  
  restoreSession() {
    try {
      const storedUser = localStorage.getItem('custom_auth_user')
      const storedProfile = localStorage.getItem('custom_auth_profile')
      const storedPermissions = localStorage.getItem('custom_auth_permissions')
      const storedSecretaria = localStorage.getItem('custom_auth_secretaria')

      if (storedUser && storedProfile) {
        this.user = JSON.parse(storedUser)
        this.profile = JSON.parse(storedProfile)
        this.permissions = storedPermissions ? JSON.parse(storedPermissions) : []
        this.secretaria = storedSecretaria ? JSON.parse(storedSecretaria) : null

        console.log('🔄 Sessão restaurada:', this.profile?.nome_completo)
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Erro ao restaurar sessão:', error)
      return false
    }
  }

  // =====================================================
  // GETTERS
  // =====================================================
  
  getUser(): CustomUser | null {
    return this.user
  }

  getProfile(): CustomProfile | null {
    return this.profile
  }

  getPermissions(): CustomPermission[] {
    return this.permissions
  }

  getSecretaria(): CustomSecretaria | null {
    return this.secretaria
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
export const customAuth = new CustomAuthService()

// Restaurar sessão ao carregar
if (typeof window !== 'undefined') {
  customAuth.restoreSession()
}