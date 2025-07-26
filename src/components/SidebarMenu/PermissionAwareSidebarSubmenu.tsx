import React from 'react'
import { SidebarSubmenu } from './SidebarSubmenu'
import { useAuth } from '../../contexts/AuthContext'
import { UserProfile } from '../../lib/auth'

interface PermissionAwareSidebarSubmenuProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  basePath: string
  
  // Controle de acesso
  requiredPermissions?: string[]
  allowedUserTypes?: UserProfile['tipo_usuario'][]
  requireAuth?: boolean
}

export function PermissionAwareSidebarSubmenu({
  title,
  icon,
  children,
  basePath,
  requiredPermissions = [],
  allowedUserTypes = [],
  requireAuth = true
}: PermissionAwareSidebarSubmenuProps) {
  const { user, profile, hasPermission } = useAuth()

  // Se requer autenticação mas não está logado, não mostrar
  if (requireAuth && !user) {
    return null
  }

  // Se não tem perfil (mesmo estando logado), não mostrar
  if (requireAuth && user && !profile) {
    return null
  }

  // Verificar tipos de usuário permitidos
  if (allowedUserTypes.length > 0 && profile && !allowedUserTypes.includes(profile.tipo_usuario)) {
    return null
  }

  // Verificar permissões específicas
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    )
    
    if (!hasAllPermissions) {
      return null
    }
  }

  // Se passou por todas as verificações, renderizar submenu
  return (
    <SidebarSubmenu
      title={title}
      icon={icon}
      basePath={basePath}
    >
      {children}
    </SidebarSubmenu>
  )
}