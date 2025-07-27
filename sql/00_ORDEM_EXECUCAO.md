# 📋 Ordem de Execução dos Scripts SQL

## 🎯 Para Nova Instância Supabase - Executar Nesta Ordem:

### 1️⃣ **Script Base (Obrigatório)**
```sql
-- Execute PRIMEIRO:
01_estrutura_base_nova_instancia.sql
```
**O que faz:** Cria toda estrutura básica (secretarias, perfis, tipos enum, etc.)

### 2️⃣ **Script de Dados (Obrigatório)**  
```sql
-- Execute SEGUNDO:
02_dados_iniciais_nova_instancia.sql
```
**O que faz:** Insere dados iniciais (secretarias padrão, perfis de acesso, permissões)

### 3️⃣ **Script de Autenticação (Obrigatório)**
```sql
-- Execute TERCEIRO:
03_auth_supabase_nativo.sql
```
**O que faz:** Configura autenticação nativa do Supabase com RLS

### 4️⃣ **Criar Usuários (Manual)**
- Ir para **Authentication → Users** no Dashboard
- Criar usuários manualmente conforme instruções

---

## ⚠️ IMPORTANTE:

- **Execute UM script por vez**
- **Aguarde cada script terminar** antes do próximo
- **NÃO pule nenhum script**
- **Execute na ordem exata**

---

## 🧪 Após Execução:

1. ✅ Verificar se tabelas foram criadas
2. ✅ Criar usuários de teste no Dashboard
3. ✅ Testar login nos portais
4. ✅ Verificar se RLS está funcionando

---

*Scripts preparados para nova instância limpa do Supabase*