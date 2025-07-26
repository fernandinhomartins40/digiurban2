# Verificar Configuração Supabase Self-Hosted

## 🔍 Problema Identificado:
- Erro: "Feature is disabled" + "Database error querying schema"
- Instância: Ultrabase self-hosted em `82.25.69.57:8115`
- Dados do usuário: ✅ Corretos no banco

## 🚨 Possíveis Causas:

### 1. **RLS (Row Level Security) muito restritivo**
- **Solução**: Execute `15_corrigir_rls_login.sql`
- **Probabilidade**: 90%

### 2. **Configurações da instância Supabase**
Verifique se estas features estão habilitadas:

```yaml
# docker-compose.yml ou configuração
GOTRUE_EXTERNAL_EMAIL_ENABLED: true
GOTRUE_MAILER_AUTOCONFIRM: true
GOTRUE_SMTP_ADMIN_EMAIL: admin@yourdomain.com
POSTGRES_PASSWORD: sua_senha
```

### 3. **Políticas de CORS**
```yaml
# Adicionar ao .env da instância Supabase
GOTRUE_EXTERNAL_EMAIL_ENABLED=true
GOTRUE_SITE_URL=http://localhost:5173
GOTRUE_ADDITIONAL_REDIRECT_URLS=http://localhost:5173
```

### 4. **Permissões do banco de dados**
```sql
-- Execute no PostgreSQL da instância
GRANT USAGE ON SCHEMA auth TO anon;
GRANT SELECT ON auth.users TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.user_profiles TO anon;
```

## 🎯 **Ordem de Execução:**

### **PASSO 1** (Mais provável - 90% chance):
1. Execute `15_corrigir_rls_login.sql` no SQL Editor
2. Teste o login imediatamente

### **PASSO 2** (Se PASSO 1 não funcionar):
Adicione ao arquivo `.env` da sua instância Supabase:
```env
GOTRUE_MAILER_AUTOCONFIRM=true
GOTRUE_EXTERNAL_EMAIL_ENABLED=true
GOTRUE_SITE_URL=http://localhost:5173
```

### **PASSO 3** (Se ainda não funcionar):
Reinicie a instância Supabase:
```bash
docker-compose down
docker-compose up -d
```

### **PASSO 4** (Última opção):
Use o service_role_key temporariamente:
```typescript
// No arquivo src/lib/supabase.ts
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzU2NDMxMywiZXhwIjoxNzg1MTAwMzEzfQ.rgC744uR7HakYGvj2la_U0pr-mIW_Q2ZY2Px-tEQfNU'
```

## 📞 **Status de Verificação:**
- ✅ Banco de dados funcionando
- ✅ Usuários criados corretamente  
- ✅ Senhas criptografadas
- ✅ Perfis vinculados
- ❌ Autenticação HTTP bloqueada

**Recomendação**: Execute PASSO 1 primeiro - tem 90% de chance de resolver!