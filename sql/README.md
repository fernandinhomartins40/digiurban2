# Scripts SQL do DigiUrban2

Esta pasta contém todos os scripts SQL necessários para configurar o banco de dados Supabase do DigiUrban2.

## Ordem de Execução

Execute os scripts na seguinte ordem no editor SQL do Supabase:

1. **01_auth_setup.sql** - Configuração inicial de autenticação
2. **02_users_profiles.sql** - Tabelas de usuários e perfis
3. **03_core_tables.sql** - Tabelas principais do sistema
4. **04_departamentos.sql** - Tabelas específicas dos departamentos
5. **05_atendimentos.sql** - Sistema de atendimentos
6. **06_alertas_notificacoes.sql** - Sistema de alertas
7. **07_chat_sistema.sql** - Sistema de chat
8. **08_policies.sql** - Políticas de segurança (RLS)
9. **09_functions.sql** - Funções e triggers
10. **10_seed_data.sql** - Dados iniciais

## Como Executar

1. Acesse o painel do Supabase
2. Vá para a seção "SQL Editor"
3. Cole o conteúdo de cada arquivo na ordem indicada
4. Execute um script por vez
5. Verifique se não há erros antes de prosseguir para o próximo

## Observações

- Sempre execute os scripts em ordem sequencial
- Verifique se não há erros antes de continuar
- Alguns scripts podem demorar alguns segundos para executar
- Em caso de erro, verifique se o script anterior foi executado corretamente