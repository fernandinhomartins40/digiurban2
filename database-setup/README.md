# Scripts de Database Setup - DigiUrban

## Ordem de Execução para Nova Instalação

Execute os scripts na seguinte ordem no SQL Editor do Supabase:

### 0. Diagnóstico (Recomendado)
- `00_diagnostico_banco.sql` - Analisa estado atual do banco

### 1. Estrutura Base (Obrigatório)
- `01_estrutura_base.sql` - Cria tabelas básicas do sistema
- `02_auth_profiles.sql` - Configura autenticação e perfis de usuário
- `03_secretarias_setores.sql` - Cria estrutura de secretarias e setores

### 2. Sistema Core (Obrigatório)
- `04_servicos_protocolos.sql` - Sistema de protocolos e serviços municipais
- `05_chat_sistema.sql` - Sistema de chat seguro
- `06_storage_setup.sql` - Configuração de storage para uploads

### 3. Correções Específicas (Se Necessário)
- `07_fix_upload_imagem.sql` - Corrige problemas de upload de foto de perfil
- `08_fix_rls_storage.sql` - Corrige políticas RLS do storage
- `09_fix_rls_storage_emergency.sql` - Solução emergencial para RLS
- `10_verify_storage_setup.sql` - Verifica configuração do storage

## Scripts Antigos (Não Usar)

Os seguintes scripts são versões antigas ou de teste e NÃO devem ser usados:
- Todos os arquivos numerados acima de 10
- Arquivos com sufixos como `_v2`, `_v3`, `_old`, etc.
- Scripts específicos de debug ou correção

## Configurações Específicas do Ambiente

Após executar os scripts principais, ajuste:
1. URLs base no arquivo `.env`
2. Credenciais do Supabase
3. Configurações de SMTP (se aplicável)
4. Buckets de storage no painel do Supabase

## Troubleshooting

Se houver problemas:
1. Execute `10_verify_setup.sql` para diagnóstico
2. Verifique os logs do Supabase
3. Confirme que todas as extensões estão habilitadas
4. Verifique as políticas RLS no painel de administração