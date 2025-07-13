# 🔐 Guia Completo: Configurando Secrets no GitHub

## 📋 Passo a Passo para Criar as Secrets

### 1. Acesse as Configurações do Repositório
1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**

### 2. Crie cada Secret individualmente

Clique em **New repository secret** para cada uma das secrets abaixo:

---

## 🖥️ Secrets Obrigatórias

### **VPS_HOST**
- **Nome:** `VPS_HOST`
- **Conteúdo:** O IP ou domínio do seu servidor VPS
- **Exemplo:** `185.244.XXX.XXX` ou `seu-servidor.hostinger.com`

### **VPS_USER**
- **Nome:** `VPS_USER`  
- **Conteúdo:** O usuário para conectar no VPS
- **Exemplo:** `root` ou `ubuntu` ou `digiurban`

### **VPS_SSH_KEY**
- **Nome:** `VPS_SSH_KEY`
- **Conteúdo:** A chave SSH privada para conectar no VPS
- **Como obter:**
  ```bash
  # No seu VPS, gere uma chave SSH
  ssh-keygen -t ed25519 -C "github-actions@digiurban.com.br"
  
  # Copie a chave PRIVADA (arquivo sem .pub)
  cat ~/.ssh/id_ed25519
  ```
- **Exemplo do conteúdo:**
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAFwAAAAdzc2gtcn
  NhAAAAAwEAAQAAAQEAy8... (resto da chave)
  -----END OPENSSH PRIVATE KEY-----
  ```

### **VPS_PORT**
- **Nome:** `VPS_PORT`
- **Conteúdo:** A porta SSH do seu VPS
- **Exemplo:** `22` (porta padrão SSH)

### **DB_PASSWORD**
- **Nome:** `DB_PASSWORD`
- **Conteúdo:** Senha do PostgreSQL para produção
- **Exemplo:** `MinhaSenh@SuperSegura123!`

### **JWT_SECRET**
- **Nome:** `JWT_SECRET`
- **Conteúdo:** Chave secreta para JWT (pelo menos 32 caracteres)
- **Exemplo:** `minha-chave-jwt-super-secreta-2024-digiurban-app`

### **REDIS_PASSWORD**
- **Nome:** `REDIS_PASSWORD`
- **Conteúdo:** Senha do Redis para produção
- **Exemplo:** `Redis@Pass2024Segura!`

---

## 📧 Secrets Opcionais (Email)

### **SMTP_HOST**
- **Nome:** `SMTP_HOST`
- **Conteúdo:** Servidor SMTP para envio de emails
- **Exemplo:** `smtp.gmail.com` ou `smtp.hostinger.com`

### **SMTP_PORT**
- **Nome:** `SMTP_PORT`
- **Conteúdo:** Porta do servidor SMTP
- **Exemplo:** `587` (TLS) ou `465` (SSL)

### **SMTP_USER**
- **Nome:** `SMTP_USER`
- **Conteúdo:** Usuário para autenticação SMTP
- **Exemplo:** `contato@digiurban.com.br`

### **SMTP_PASSWORD**
- **Nome:** `SMTP_PASSWORD`
- **Conteúdo:** Senha para autenticação SMTP
- **Exemplo:** `senha-email-app`

---

## 🔔 Secrets Opcionais (Notificações)

### **SLACK_WEBHOOK**
- **Nome:** `SLACK_WEBHOOK`
- **Conteúdo:** URL do webhook do Slack (opcional)
- **Exemplo:** `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

---

## ✅ Verificação das Secrets

Após criar todas as secrets, você deve ver na página **Secrets and variables** → **Actions**:

- ✅ VPS_HOST
- ✅ VPS_USER  
- ✅ VPS_SSH_KEY
- ✅ VPS_PORT
- ✅ DB_PASSWORD
- ✅ JWT_SECRET
- ✅ REDIS_PASSWORD
- ✅ SMTP_HOST (opcional)
- ✅ SMTP_PORT (opcional)
- ✅ SMTP_USER (opcional)
- ✅ SMTP_PASSWORD (opcional)
- ✅ SLACK_WEBHOOK (opcional)

---

## 🔧 Testando as Secrets

Para testar se as secrets estão funcionando, você pode:

1. **Fazer um commit e push** para a branch `main`
2. **Acompanhar o workflow** em **Actions** → **Deploy to Hostinger VPS**
3. **Verificar os logs** para ver se a conexão SSH está funcionando

---

## 🚨 Dicas Importantes

### Segurança
- ❌ **NUNCA** coloque informações sensíveis diretamente no código
- ❌ **NUNCA** commite arquivos `.env` com dados reais
- ✅ **SEMPRE** use secrets para dados sensíveis
- ✅ **SEMPRE** gere senhas fortes e únicas

### Troubleshooting
- Se houver erro de SSH, verifique se a chave SSH está correta
- Se houver erro de conexão, verifique o IP/domínio do VPS
- Se houver erro de porta, verifique se a porta SSH está correta
- Se houver erro de usuário, verifique se o usuário existe no VPS

---

## 💡 Exemplo Prático

### Como criar a secret VPS_SSH_KEY:

1. **No seu VPS:**
   ```bash
   # Gerar chave SSH
   ssh-keygen -t ed25519 -f ~/.ssh/github_actions_key
   
   # Adicionar a chave pública ao authorized_keys
   cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
   
   # Copiar a chave privada
   cat ~/.ssh/github_actions_key
   ```

2. **No GitHub:**
   - Nome: `VPS_SSH_KEY`
   - Conteúdo: Cole todo o conteúdo da chave privada (incluindo as linhas BEGIN e END)

3. **Testar:**
   ```bash
   # No seu computador local
   ssh -i ~/.ssh/github_actions_key usuario@seu-vps.com
   ```

---

## 🎯 Próximos Passos

Após configurar todas as secrets:

1. ✅ Faça commit e push das alterações
2. ✅ Acompanhe o workflow em **Actions**
3. ✅ Verifique se a aplicação está funcionando em `https://www.digiurban.com.br`
4. ✅ Monitore os logs em caso de erro

> **Lembre-se:** As secrets são criptografadas e só ficam visíveis durante a execução do workflow. Elas não aparecem nos logs públicos do GitHub Actions. 