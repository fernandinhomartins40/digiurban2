import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageSquare, Users, Crown, Shield, User, UserCheck } from "lucide-react";
import { chatService } from "@/lib/chat";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  nome_completo: string;
  email: string;
  tipo_usuario: string;
  secretaria?: string;
  setor?: string;
  cargo?: string;
  foto_perfil_url?: string;
}

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (userId: string, userName: string) => void;
}

const UserSearchDialog: React.FC<UserSearchDialogProps> = ({
  open,
  onOpenChange,
  onUserSelect
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar todos os usuários do sistema
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          nome_completo,
          email,
          tipo_usuario,
          secretaria,
          setor,
          cargo,
          foto_perfil_url
        `)
        .neq('id', user?.id) // Excluir o próprio usuário
        .order('nome_completo');

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar usuários baseado na busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tipo_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.secretaria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Carregar usuários quando o diálogo abrir
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const getUserTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'secretario':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'diretor':
      case 'coordenador':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'funcionario':
      case 'atendente':
        return <User className="h-4 w-4 text-green-500" />;
      case 'cidadao':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getUserTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'super_admin': 'Super Admin',
      'admin': 'Administrador',
      'secretario': 'Secretário',
      'diretor': 'Diretor',
      'coordenador': 'Coordenador',
      'funcionario': 'Funcionário',
      'atendente': 'Atendente',
      'cidadao': 'Cidadão'
    };
    return labels[tipo] || tipo;
  };

  const getUserTypeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'super_admin': 'bg-yellow-100 text-yellow-800',
      'admin': 'bg-red-100 text-red-800',
      'secretario': 'bg-blue-100 text-blue-800',
      'diretor': 'bg-purple-100 text-purple-800',
      'coordenador': 'bg-purple-100 text-purple-800',
      'funcionario': 'bg-green-100 text-green-800',
      'atendente': 'bg-green-100 text-green-800',
      'cidadao': 'bg-gray-100 text-gray-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const handleUserSelect = async (selectedUser: UserProfile) => {
    try {
      await onUserSelect(selectedUser.id, selectedUser.nome_completo);
      onOpenChange(false);
      setSearchTerm("");
    } catch (error) {
      console.error('Error selecting user:', error);
      toast.error('Erro ao iniciar conversa');
    }
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Iniciar Nova Conversa
          </DialogTitle>
          <DialogDescription>
            Busque e selecione um usuário para iniciar uma conversa direta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email, cargo ou secretaria..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Lista de usuários */}
          <ScrollArea className="h-[400px] border rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">Carregando usuários...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">
                    {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário disponível'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredUsers.map((userProfile) => (
                  <div
                    key={userProfile.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleUserSelect(userProfile)}
                  >
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      {userProfile.foto_perfil_url ? (
                        <img 
                          src={userProfile.foto_perfil_url} 
                          alt={userProfile.nome_completo}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(userProfile.nome_completo)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* Informações do usuário */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm truncate">
                          {userProfile.nome_completo}
                        </p>
                        {getUserTypeIcon(userProfile.tipo_usuario)}
                      </div>
                      
                      <p className="text-xs text-gray-500 truncate">
                        {userProfile.email}
                      </p>
                      
                      {(userProfile.secretaria || userProfile.cargo) && (
                        <p className="text-xs text-gray-400 truncate">
                          {userProfile.cargo && `${userProfile.cargo}`}
                          {userProfile.cargo && userProfile.secretaria && ' • '}
                          {userProfile.secretaria}
                        </p>
                      )}
                    </div>

                    {/* Badge do tipo de usuário */}
                    <Badge variant="outline" className={getUserTypeColor(userProfile.tipo_usuario)}>
                      {getUserTypeLabel(userProfile.tipo_usuario)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchDialog;