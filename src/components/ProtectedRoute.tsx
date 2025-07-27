import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserProfile } from '../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedUserTypes?: UserProfile['tipo_usuario'][]
  requiredPermissions?: string[]
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  allowedUserTypes,
  requiredPermissions,
  fallbackPath = '/auth/login'
}: ProtectedRouteProps) {
  const { user, profile, loading, hasPermission } = useAuth()
  const location = useLocation()

  // Mostrar loading enquanto carrega autenticação
  if (loading) {
    console.log('🔒 ProtectedRoute: Carregando autenticação...')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se requer autenticação mas não está logado
  if (requireAuth && !user) {
    console.warn('🔒 ProtectedRoute: Usuário não autenticado, redirecionando para:', fallbackPath)
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Se não requer autenticação, deixar passar
  if (!requireAuth) {
    console.log('🔒 ProtectedRoute: Rota pública, permitindo acesso')
    return <>{children}</>
  }

  // Se não tem perfil (mesmo estando logado), redirecionar para logout
  if (requireAuth && user && !profile) {
    console.warn('🔒 ProtectedRoute: Usuário autenticado mas sem perfil, redirecionando para:', fallbackPath)
    return <Navigate to={fallbackPath} replace />
  }

  // Verificar tipos de usuário permitidos
  if (allowedUserTypes && profile && !allowedUserTypes.includes(profile.tipo_usuario)) {
    console.warn('🔒 ProtectedRoute: Tipo de usuário não permitido:', profile.tipo_usuario, 'Permitidos:', allowedUserTypes)
    return <Navigate to="/unauthorized" replace />
  }

  // Verificar permissões específicas
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )
    
    if (!hasAllPermissions) {
      console.warn('🔒 ProtectedRoute: Usuário não tem todas as permissões necessárias')
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Se passou por todas as verificações, renderizar componente
  console.log('✅ ProtectedRoute: Acesso autorizado para:', user?.email, profile?.tipo_usuario)
  return <>{children}</>
}

// Componente específico para rotas administrativas
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedUserTypes={['super_admin', 'admin', 'secretario', 'diretor', 'coordenador', 'funcionario', 'atendente']}
      fallbackPath="/admin/login"
    >
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para rotas de super admin
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedUserTypes={['super_admin']}
      fallbackPath="/unauthorized"
    >
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para rotas de administradores
export function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedUserTypes={['super_admin', 'admin']}
      fallbackPath="/unauthorized"
    >
      {children}
    </ProtectedRoute>
  )
}

// Componente específico para rotas de cidadãos
export function CitizenRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      allowedUserTypes={['cidadao']}
      fallbackPath="/cidadao/login"
    >
      {children}
    </ProtectedRoute>
  )
}

// Componente para rotas que requerem permissões específicas
export function PermissionRoute({ 
  children, 
  permissions 
}: { 
  children: React.ReactNode
  permissions: string[]
}) {
  return (
    <ProtectedRoute
      requiredPermissions={permissions}
      fallbackPath="/unauthorized"
    >
      {children}
    </ProtectedRoute>
  )
}