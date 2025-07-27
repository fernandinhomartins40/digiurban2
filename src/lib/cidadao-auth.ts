import { supabase } from './supabase'

export const cidadaoAuthService = {
  // Login simples para cidadãos
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
      
      return { user: data.user, profile }
    }
    
    return { user: data.user, profile: null }
  },

  // Registro simples para cidadãos
  async signUp(email: string, password: string, nomeCompleto: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: nomeCompleto,
          tipo_usuario: 'cidadao'
        }
      }
    })
    
    if (error) throw error
    return data
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
  }
}