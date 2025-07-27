import { supabase } from './supabase'

// Usar apenas a interface padrão do user_profiles
export interface AdminUser {
  id: string
  email: string
  nome_completo: string
  tipo_usuario: string
  secretaria_id: string | null
  cargo: string | null
  status: string
}

export const adminAuthService = {
  // Login simples usando apenas Supabase Auth
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // Buscar perfil do usuário
    if (data.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      // Verificar se é usuário administrativo
      if (!profile || profile.tipo_usuario === 'cidadao') {
        await supabase.auth.signOut()
        throw new Error('Acesso negado. Portal exclusivo para servidores.')
      }
      
      return { user: data.user, profile }
    }
    
    return { user: data.user, profile: null }
  },

  // Logout simples
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Buscar usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { user, profile }
  },

  // Verificar se é admin
  isAdmin(profile: any) {
    return profile?.tipo_usuario !== 'cidadao'
  }
}