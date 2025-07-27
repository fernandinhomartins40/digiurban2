# 📸 Setup de Foto de Perfil - DigiUrbis

## Funcionalidades Implementadas

✅ **Upload de Foto de Perfil Completo**:
- Ferramenta de crop com seleção de área
- Compressão automática para otimizar tamanho
- Formato WebP para máxima otimização
- Tamanho padrão: 200x200px
- Limite de tamanho: 100KB após compressão
- Preview em tempo real

✅ **Tecnologias Utilizadas**:
- `react-image-crop` - Ferramenta de crop interativa
- `browser-image-compression` - Compressão de imagem
- Supabase Storage - Armazenamento de arquivos
- WebP - Formato otimizado de imagem

## ⚙️ Setup do Banco de Dados

**IMPORTANTE**: Execute este script SQL no Supabase antes de usar a funcionalidade:

```sql
-- Execute no SQL Editor do Supabase: http://82.25.69.57:8162/project/default/sql
```

1. Acesse o SQL Editor do Supabase
2. Execute o arquivo: `database-setup/03_add_profile_image_column.sql`
3. Verifique se o bucket `user-uploads` foi criado no Storage

## 🚀 Como Usar

### No Perfil do Usuário:

1. **Acesse**: `/admin/configuracoes/meu-perfil` ou `/cidadao/configuracoes/meu-perfil`
2. **Clique**: "Alterar foto" na seção Foto de Perfil
3. **Selecione**: uma imagem (JPG, PNG, WEBP, máx 10MB)
4. **Ajuste**: a área de crop arrastando e redimensionando
5. **Preview**: visualize o resultado final (200x200px)
6. **Salve**: a imagem será comprimida e salva automaticamente

### Funcionalidades Avançadas:

- **Crop Inteligente**: Proporção 1:1 (quadrado) automática
- **Compressão Automática**: Reduz para ~100KB mantendo qualidade
- **Formato WebP**: Máxima otimização de tamanho
- **Preview Real**: Mostra exatamente como ficará no perfil
- **Remoção**: Opção para remover foto de perfil

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── ProfileImageUpload.tsx       # Componente principal
├── hooks/
│   └── useProfile.tsx              # Hook para gerenciar perfil
├── pages/configuracoes/
│   └── MeuPerfil.tsx              # Página integrada
└── index.css                      # Estilos do react-image-crop

database-setup/
└── 03_add_profile_image_column.sql # Script de setup DB
```

## 🗄️ Estrutura do Storage

**Bucket**: `user-uploads`
**Pasta**: `profiles/`
**Nomenclatura**: `profile-{user_id}-{timestamp}.webp`
**Políticas RLS**: 
- ✅ Upload apenas do próprio usuário
- ✅ Visualização pública das fotos
- ✅ Atualização/remoção apenas do próprio usuário

## 🔧 Configurações Técnicas

### Compressão de Imagem:
```typescript
const CONFIG = {
  width: 200,           // Largura final
  height: 200,          // Altura final  
  quality: 0.8,         // Qualidade (80%)
  maxSizeMB: 0.1,      // Máximo 100KB
  format: 'webp'        // Formato otimizado
};
```

### Validações:
- ✅ Tipos aceitos: JPG, PNG, WEBP, GIF
- ✅ Tamanho máximo antes compressão: 10MB
- ✅ Tamanho final após compressão: 100KB
- ✅ Proporção forçada: 1:1 (quadrado)
- ✅ Resolução final: 200x200px

## 🔒 Segurança

### Políticas RLS Implementadas:
- **Upload**: Usuário só pode fazer upload de suas próprias fotos
- **Visualização**: Fotos são públicas (necessário para exibição)
- **Atualização**: Usuário só pode atualizar suas próprias fotos
- **Remoção**: Usuário só pode remover suas próprias fotos

### Validações de Segurança:
- ✅ Verificação de tipo de arquivo no frontend
- ✅ Validação de tamanho antes do upload
- ✅ Compressão forçada para evitar arquivos grandes
- ✅ Nomenclatura única com timestamp
- ✅ Pasta específica para isolamento

## 🐛 Solução de Problemas

### Erro de Upload:
1. Verifique se o bucket `user-uploads` existe
2. Confirme se as políticas RLS estão ativas
3. Verifique se o usuário está autenticado

### Erro de Compressão:
1. Arquivo muito grande (> 10MB)
2. Formato não suportado
3. Verifique console para detalhes

### Erro de Crop:
1. Recarregue a página
2. Selecione uma nova imagem
3. Verifique se a imagem não está corrompida

## 📊 Monitoramento

### Logs Implementados:
```typescript
console.log('📸 Imagem comprimida: XKB');      // Tamanho final
console.log('✅ Foto de perfil atualizada');    // Sucesso
console.error('❌ Erro no upload:', error);     // Erros
```

### Métricas de Storage:
- Monitor de uso do bucket `user-uploads`
- Análise de tamanhos de arquivo
- Frequência de uploads por usuário

---

**✨ A funcionalidade está 100% implementada e pronta para uso!**

Todos os aspectos foram cuidadosamente implementados: crop, compressão, storage, segurança e otimização.