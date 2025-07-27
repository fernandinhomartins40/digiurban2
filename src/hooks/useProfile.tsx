import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProfileData {
  nome_completo: string;
  email: string;
  telefone?: string;
  foto_perfil?: string;
  bio?: string;
  secretaria_id?: string;
  tipo_usuario: string;
}

export const useProfile = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setProfileData({
        nome_completo: profile.nome_completo,
        email: user?.email || '',
        telefone: profile.telefone,
        foto_perfil: profile.foto_perfil,
        bio: profile.bio,
        secretaria_id: profile.secretaria_id,
        tipo_usuario: profile.tipo_usuario
      });
    }
  }, [profile, user]);

  // Atualizar dados do perfil
  const updateProfile = async (data: Partial<ProfileData>): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Atualizando perfil do usuário...');
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Mapear campos do formulário para o banco
      if (data.nome_completo) updateData.nome_completo = data.nome_completo;
      if (data.telefone !== undefined) updateData.telefone = data.telefone;
      if (data.foto_perfil !== undefined) updateData.foto_perfil = data.foto_perfil;
      if (data.bio !== undefined) updateData.bio = data.bio;

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (profileError) {
        console.error('❌ Erro ao atualizar perfil:', profileError);
        throw profileError;
      }

      // Atualizar email se fornecido e diferente
      if (data.email && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });

        if (emailError) {
          console.error('❌ Erro ao atualizar email:', emailError);
          // Não falhar completamente se só o email deu erro
          toast.error('Perfil atualizado, mas houve erro ao alterar email');
        }
      }

      console.log('✅ Perfil atualizado com sucesso');
      
      // Atualizar estado local
      setProfileData(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Perfil atualizado com sucesso!');
      return true;

    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao atualizar perfil: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar apenas foto de perfil
  const updateProfileImage = async (imageUrl: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    try {
      console.log('🔄 Atualizando foto de perfil...');
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          foto_perfil: imageUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro ao atualizar foto:', error);
        throw error;
      }

      console.log('✅ Foto de perfil atualizada');
      
      // Atualizar estado local
      setProfileData(prev => prev ? { ...prev, foto_perfil: imageUrl } : null);
      
      return true;

    } catch (error) {
      console.error('❌ Erro ao atualizar foto:', error);
      toast.error('Erro ao atualizar foto de perfil');
      return false;
    }
  };

  // Remover foto de perfil
  const removeProfileImage = async (): Promise<boolean> => {
    return updateProfileImage('');
  };

  return {
    profileData,
    isLoading,
    updateProfile,
    updateProfileImage,
    removeProfileImage
  };
};