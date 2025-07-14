# ✅ Verificação de Secrets GitHub

## Secrets Obrigatórias

Acesse: **Settings** → **Secrets and variables** → **Actions**

### 1. VPS_HOST
- **Nome:** `VPS_HOST`
- **Valor:** IP da sua VPS (ex: 185.244.123.456)

### 2. VPS_USER
- **Nome:** `VPS_USER`
- **Valor:** `root`

### 3. VPS_SSH_KEY
- **Nome:** `VPS_SSH_KEY`
- **Valor:** Chave SSH privada completa (incluindo BEGIN/END)

### 4. VPS_PORT
- **Nome:** `VPS_PORT`
- **Valor:** `22`

### 5. DB_PASSWORD
- **Nome:** `DB_PASSWORD`
- **Valor:** Senha forte para PostgreSQL (ex: `MinhaSenh@123!`)

### 6. JWT_SECRET
- **Nome:** `JWT_SECRET`
- **Valor:** Chave secreta longa (ex: `minha-chave-jwt-super-secreta-2024`)

## 🧪 Teste de Conectividade

Para testar se a chave SSH está funcionando:

```bash
# No seu computador local, teste a conexão
ssh -i ~/.ssh/github_actions root@SEU_IP_VPS

# Se funcionar, a chave está correta
```

## 🔧 Script de Teste

Execute este script na VPS para verificar tudo:

```bash
#!/bin/bash
echo "🔍 Verificando configuração SSH..."

# Verificar chave SSH
if [ -f ~/.ssh/github_actions ]; then
    echo "✅ Chave SSH existe"
    ls -la ~/.ssh/github_actions*
else
    echo "❌ Chave SSH não encontrada"
fi

# Verificar authorized_keys
if [ -f ~/.ssh/authorized_keys ]; then
    echo "✅ authorized_keys existe"
    echo "📝 Chaves autorizadas:"
    cat ~/.ssh/authorized_keys
else
    echo "❌ authorized_keys não encontrado"
fi

# Verificar permissões
echo "📋 Permissões SSH:"
ls -la ~/.ssh/

# Verificar serviço SSH
echo "🔌 Status SSH:"
systemctl status ssh --no-pager
``` 