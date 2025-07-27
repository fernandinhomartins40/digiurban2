import { ReactNode, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionAwareComponentProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean; // Se true, precisa de todas as permissões. Se false, precisa de pelo menos uma
  requiredUserTypes?: string[];
  requiredSecretariat?: string;
  requiredSector?: string;
  fallback?: ReactNode;
  onAccessDenied?: () => void;
}

export const PermissionAwareComponent = ({
  children,
  requiredPermissions = [],
  requireAll = false,
  requiredUserTypes = [],
  requiredSecretariat,
  requiredSector,
  fallback = null,
  onAccessDenied
}: PermissionAwareComponentProps) => {
  const { user, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !profile) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        let accessGranted = true;

        // Verificar tipo de usuário
        if (requiredUserTypes.length > 0) {
          accessGranted = accessGranted && requiredUserTypes.includes(profile.tipo_usuario);
        }

        // Verificar secretaria
        if (requiredSecretariat && !(['super_admin', 'admin'].includes(profile.tipo_usuario))) {
          const canAccessSecretariat = await authService.canAccessSecretariat(user.id, requiredSecretariat);
          accessGranted = accessGranted && canAccessSecretariat;
        }

        // Verificar setor
        if (requiredSector && !(['super_admin', 'admin', 'secretario'].includes(profile.tipo_usuario))) {
          const canAccessSector = await authService.canAccessSector(user.id, requiredSector);
          accessGranted = accessGranted && canAccessSector;
        }

        // Verificar permissões específicas
        if (requiredPermissions.length > 0) {
          if (requireAll) {
            const hasAllPermissions = await authService.hasAllPermissions(user.id, requiredPermissions);
            accessGranted = accessGranted && hasAllPermissions;
          } else {
            const hasAnyPermission = await authService.hasAnyPermission(user.id, requiredPermissions);
            accessGranted = accessGranted && hasAnyPermission;
          }
        }

        setHasAccess(accessGranted);

        if (!accessGranted && onAccessDenied) {
          onAccessDenied();
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, profile, requiredPermissions, requireAll, requiredUserTypes, requiredSecretariat, requiredSector, onAccessDenied]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user, profile } = useAuth();

  const checkPermission = async (permissionCode: string): Promise<boolean> => {
    if (!user) return false;
    return await authService.hasPermission(user.id, permissionCode);
  };

  const checkAnyPermission = async (permissionCodes: string[]): Promise<boolean> => {
    if (!user) return false;
    return await authService.hasAnyPermission(user.id, permissionCodes);
  };

  const checkAllPermissions = async (permissionCodes: string[]): Promise<boolean> => {
    if (!user) return false;
    return await authService.hasAllPermissions(user.id, permissionCodes);
  };

  const canAccessSecretariat = async (secretariatId?: string): Promise<boolean> => {
    if (!user) return false;
    return await authService.canAccessSecretariat(user.id, secretariatId);
  };

  const canAccessSector = async (sectorId?: string): Promise<boolean> => {
    if (!user) return false;
    return await authService.canAccessSector(user.id, sectorId);
  };

  const isAdmin = (): boolean => {
    return profile?.tipo_usuario === 'super_admin' || profile?.tipo_usuario === 'admin';
  };

  const isSecretario = (): boolean => {
    return profile?.tipo_usuario === 'secretario';
  };

  const isFuncionario = (): boolean => {
    return ['funcionario', 'atendente', 'coordenador', 'diretor'].includes(profile?.tipo_usuario || '');
  };

  const isCidadao = (): boolean => {
    return profile?.tipo_usuario === 'cidadao';
  };

  const getUserSecretariat = (): string | null => {
    return profile?.secretaria_id || null;
  };

  const getUserSector = (): string | null => {
    return profile?.setor_id || null;
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccessSecretariat,
    canAccessSector,
    isAdmin,
    isSecretario,
    isFuncionario,
    isCidadao,
    getUserSecretariat,
    getUserSector,
    profile
  };
};

// Componentes específicos para diferentes níveis de acesso
export const AdminOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionAwareComponent
    requiredUserTypes={['super_admin', 'admin']}
    fallback={fallback}
  >
    {children}
  </PermissionAwareComponent>
);

export const SecretarioOnly = ({ children, secretariatId, fallback }: { 
  children: ReactNode; 
  secretariatId?: string;
  fallback?: ReactNode;
}) => (
  <PermissionAwareComponent
    requiredUserTypes={['super_admin', 'admin', 'secretario']}
    requiredSecretariat={secretariatId}
    fallback={fallback}
  >
    {children}
  </PermissionAwareComponent>
);

export const FuncionarioOnly = ({ children, sectorId, fallback }: { 
  children: ReactNode; 
  sectorId?: string;
  fallback?: ReactNode;
}) => (
  <PermissionAwareComponent
    requiredUserTypes={['super_admin', 'admin', 'secretario', 'funcionario', 'atendente', 'coordenador', 'diretor']}
    requiredSector={sectorId}
    fallback={fallback}
  >
    {children}
  </PermissionAwareComponent>
);

export const CidadaoOnly = ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
  <PermissionAwareComponent
    requiredUserTypes={['cidadao']}
    fallback={fallback}
  >
    {children}
  </PermissionAwareComponent>
);

// Componente para exibir componentes baseados em permissões específicas
export const WithPermission = ({ 
  children, 
  permissions, 
  requireAll = false, 
  fallback 
}: { 
  children: ReactNode; 
  permissions: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}) => (
  <PermissionAwareComponent
    requiredPermissions={permissions}
    requireAll={requireAll}
    fallback={fallback}
  >
    {children}
  </PermissionAwareComponent>
);