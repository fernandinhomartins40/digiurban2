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
  
  # Adicione a chave pública ao authorized_keys
  cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
  
  # Copie a chave PRIVADA para usar como secret
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

### Obrigatórias:
- ✅ VPS_HOST
- ✅ VPS_USER  
- ✅ VPS_SSH_KEY
- ✅ VPS_PORT
- ✅ DB_PASSWORD
- ✅ JWT_SECRET

### Opcionais:
- ✅ SMTP_HOST (opcional)
- ✅ SMTP_PORT (opcional)
- ✅ SMTP_USER (opcional)
- ✅ SMTP_PASSWORD (opcional)
- ✅ SLACK_WEBHOOK (opcional)

---

## 🔧 Testando as Secrets

Para testar se as secrets estão funcionando, você pode:

1. **Fazer um commit e push** para a branch `main`
2. **Acompanhar o workflow** em **Actions** → **🚀 Deploy DigiUrban**
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

1. **Conecte-se ao seu VPS:**
   ```bash
   ssh root@185.244.XXX.XXX
   ```

2. **Gere uma chave SSH específica para o deploy:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@digiurban.com.br" -f ~/.ssh/github_actions
   ```

3. **Adicione a chave pública ao authorized_keys:**
   ```bash
   cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
   ```

4. **Copie a chave privada e cole como secret:**
   ```bash
   cat ~/.ssh/github_actions
   ```

5. **Cole o conteúdo completo (incluindo BEGIN/END) na secret VPS_SSH_KEY**

---

## 🎯 Lista de Verificação Final

Antes de fazer o deploy, certifique-se de que:

- [ ] Todas as secrets obrigatórias estão criadas
- [ ] A chave SSH foi gerada e adicionada ao VPS
- [ ] O domínio está apontando para o IP do VPS
- [ ] A porta SSH está correta (normalmente 22)
- [ ] O usuário tem permissões de sudo no VPS
- [ ] As senhas são fortes e únicas

---

## 🚀 Próximos Passos

Após configurar as secrets:

1. Faça um commit e push para a branch `main`
2. Acompanhe o workflow em **Actions**
3. Verifique se a aplicação está funcionando em `https://www.digiurban.com.br`
4. Configure o domínio e SSL se necessário 