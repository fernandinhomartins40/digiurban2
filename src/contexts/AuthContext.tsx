import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { authService, UserProfile, Permissao } from '../lib/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  permissions: Permissao[]
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  signUpCitizen: (email: string, password: string, nomeCompleto: string, cpf: string, telefone: string) => Promise<any>
  signUpServer: (
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string,
    telefone: string,
    tipoUsuario: UserProfile['tipo_usuario'],
    secretariaId: string,
    cargo: string
  ) => Promise<any>
  hasPermission: (permissionCode: string) => boolean
  isAdmin: () => boolean
  isCitizen: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [permissions, setPermissions] = useState<Permissao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listener para mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(async (user, profile) => {
      setUser(user)
      setProfile(profile)
      
      if (user && profile) {
        // Carregar permissões
        try {
          const userPermissions = await authService.getUserPermissions(user.id)
          setPermissions(userPermissions)
        } catch (error) {
          console.error('Erro ao carregar permissões:', error)
          setPermissions([])
        }
      } else {
        setPermissions([])
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
      setProfile(null)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }

  const signUpCitizen = async (email: string, password: string, nomeCompleto: string, cpf: string, telefone: string) => {
    setLoading(true)
    try {
      return await authService.signUpCitizen(email, password, nomeCompleto, cpf, telefone)
    } finally {
      setLoading(false)
    }
  }

  const signUpServer = async (
    email: string, 
    password: string, 
    nomeCompleto: string, 
    cpf: string,
    telefone: string,
    tipoUsuario: UserProfile['tipo_usuario'],
    secretariaId: string,
    cargo: string
  ) => {
    setLoading(true)
    try {
      return await authService.signUpServer(email, password, nomeCompleto, cpf, telefone, tipoUsuario, secretariaId, cargo)
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (permissionCode: string): boolean => {
    return permissions.some(p => p.codigo === permissionCode)
  }

  const isAdmin = (): boolean => {
    return profile?.tipo_usuario === 'super_admin' || profile?.tipo_usuario === 'admin'
  }

  const isCitizen = (): boolean => {
    return profile?.tipo_usuario === 'cidadao'
  }

  const value = {
    user,
    profile,
    permissions,
    loading,
    signIn,
    signOut,
    signUpCitizen,
    signUpServer,
    hasPermission,
    isAdmin,
    isCitizen
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}