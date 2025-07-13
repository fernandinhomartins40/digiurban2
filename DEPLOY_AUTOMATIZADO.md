# 🚀 Deploy Automatizado - DigiUrban

## 📋 Resumo do Sistema

Este guia mostra como fazer o deploy 100% automatizado do DigiUrban na sua VPS da Hostinger usando GitHub Actions.

### ✨ O que o sistema faz automaticamente:

- 🏗️ **Cria toda a estrutura** da aplicação do zero
- 📦 **Instala todas as dependências** do sistema
- 🗄️ **Configura o banco de dados** PostgreSQL
- 🔒 **Configura SSL** com Let's Encrypt
- 🌐 **Configura Nginx** com proxy reverso
- 🐳 **Sobe containers** Docker organizados
- 🔄 **Executa migrations** do banco
- 🩺 **Verifica a saúde** da aplicação
- 💾 **Configura backups** automáticos
- 🔄 **Faz rollback** se algo der errado

---

## 🔧 Pré-requisitos

### 1. ✅ Requisitos Obrigatórios
- [ ] Conta GitHub com repositório DigiUrban
- [ ] VPS Hostinger com Ubuntu/Debian
- [ ] Domínio www.digiurban.com.br apontado para o IP da VPS
- [ ] Acesso SSH à VPS

### 2. ✅ Informações que você vai precisar:
- IP da VPS (exemplo: 185.244.XXX.XXX)
- Usuário SSH (exemplo: root)
- Porta SSH (normalmente 22)
- Senhas para banco e Redis

---

## 🎯 Passo a Passo Completo

### **Passo 1: Preparar o Servidor (OPCIONAL)**

Se quiser preparar o servidor manualmente antes do deploy automático:

```bash
# Conectar na VPS
ssh root@185.244.XXX.XXX

# Baixar e executar script de preparação
curl -fsSL https://raw.githubusercontent.com/fernandinhomartins040/digiurban2/main/scripts/install-server.sh | bash
```

> **Nota:** Este passo é opcional. O workflow do GitHub Actions já faz toda a configuração automaticamente.

### **Passo 2: Configurar Secrets no GitHub**

1. **Acesse seu repositório no GitHub**
2. **Clique em `Settings` > `Secrets and variables` > `Actions`**
3. **Clique em `New repository secret`** para cada secret abaixo:

#### 🔑 Secrets Obrigatórias:

| Nome | Valor | Exemplo |
|------|-------|---------|
| `VPS_HOST` | IP ou domínio da VPS | `185.244.XXX.XXX` |
| `VPS_USER` | Usuário SSH | `root` |
| `VPS_SSH_KEY` | Chave SSH privada | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | Porta SSH | `22` |
| `DB_PASSWORD` | Senha do PostgreSQL | `MinhaSenh@SuperSegura123!` |
| `JWT_SECRET` | Chave secreta JWT | `minha-chave-jwt-super-secreta-2024` |
| `REDIS_PASSWORD` | Senha do Redis | `Redis@Pass2024Segura!` |

#### 📧 Secrets Opcionais (Email):

| Nome | Valor | Exemplo |
|------|-------|---------|
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Usuário SMTP | `contato@digiurban.com.br` |
| `SMTP_PASSWORD` | Senha SMTP | `senha-email-app` |

#### 💬 Secrets Opcionais (Notificações):

| Nome | Valor | Exemplo |
|------|-------|---------|
| `SLACK_WEBHOOK` | URL do webhook Slack | `https://hooks.slack.com/services/...` |

### **Passo 3: Configurar Chave SSH**

#### 3.1. Gerar chave SSH na VPS:

```bash
# Conectar na VPS
ssh root@185.244.XXX.XXX

# Gerar chave SSH
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_key -N ""

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys

# Mostrar chave privada (copie todo o conteúdo)
cat ~/.ssh/github_actions_key
```

#### 3.2. Copiar chave para o GitHub:

- **Nome:** `VPS_SSH_KEY`
- **Valor:** Cole todo o conteúdo da chave privada (incluindo as linhas BEGIN e END)

### **Passo 4: Verificar Configuração do Domínio**

Confirme que o domínio está apontando para a VPS:

```bash
# Verificar DNS
nslookup www.digiurban.com.br

# Deve retornar o IP da sua VPS
```

### **Passo 5: Executar o Deploy**

#### 5.1. Fazer commit e push:

```bash
# Adicionar alterações
git add .

# Commit
git commit -m "feat: configurar deploy automatizado"

# Push para branch main
git push origin main
```

#### 5.2. Acompanhar o deploy:

1. **Acesse:** `https://github.com/seu-usuario/digiurban2/actions`
2. **Clique no workflow:** "Deploy to Hostinger VPS"
3. **Acompanhe os logs** em tempo real

### **Passo 6: Verificar Deploy**

#### 6.1. Aguardar conclusão:
- ⏳ Build e testes (2-3 minutos)
- 🐳 Build da imagem Docker (3-5 minutos)
- 🚀 Deploy no VPS (5-10 minutos)
- 🩺 Verificação de saúde (1-2 minutos)

#### 6.2. Acessar aplicação:
- 🌐 **Frontend:** https://www.digiurban.com.br
- 🔄 **Redirecionamento:** http://www.digiurban.com.br → https://www.digiurban.com.br

---

## 📊 Monitoramento

### **Verificar Status dos Serviços**

```bash
# Conectar na VPS
ssh root@185.244.XXX.XXX

# Ir para diretório da aplicação
cd /var/www/digiurban

# Verificar containers
docker-compose ps

# Verificar logs
docker-compose logs -f
```

### **Usar Script de Monitoramento**

```bash
# Executar script de monitoramento
./scripts/monitor.sh

# Verificar status geral
./scripts/manage.sh status
```

### **Verificar Certificado SSL**

```bash
# Verificar certificado SSL
openssl s_client -connect www.digiurban.com.br:443 -servername www.digiurban.com.br
```

---

## 🔧 Comandos Úteis

### **Gerenciamento da Aplicação**

```bash
# Status completo
./scripts/manage.sh status

# Reiniciar aplicação
./scripts/manage.sh restart

# Ver logs
./scripts/manage.sh logs

# Backup manual
./scripts/manage.sh backup

# Limpeza
./scripts/manage.sh cleanup
```

### **Comandos Docker**

```bash
# Ver containers
docker-compose ps

# Logs da aplicação
docker-compose logs app

# Logs do banco
docker-compose logs db

# Reiniciar serviço específico
docker-compose restart app

# Parar tudo
docker-compose down

# Subir tudo
docker-compose up -d
```

### **Comandos de Banco de Dados**

```bash
# Conectar no banco
docker exec -it digiurban_db psql -U digiurban -d digiurban_db

# Backup manual
docker exec digiurban_db pg_dump -U digiurban digiurban_db > backup.sql

# Restaurar backup
docker exec -i digiurban_db psql -U digiurban -d digiurban_db < backup.sql
```

---

## 🚨 Resolução de Problemas

### **Deploy Falhou**

1. **Verifique os logs no GitHub Actions**
2. **Confirme que todas as secrets estão configuradas**
3. **Verifique conexão SSH:**
   ```bash
   ssh -i ~/.ssh/github_actions_key root@185.244.XXX.XXX
   ```

### **Certificado SSL não Funciona**

1. **Verifique se o domínio está apontando corretamente**
2. **Aguarde propagação DNS (até 24h)**
3. **Renove manualmente se necessário:**
   ```bash
   sudo certbot renew
   ```

### **Aplicação não Responde**

1. **Verifique containers:**
   ```bash
   docker-compose ps
   ```

2. **Verifique logs:**
   ```bash
   docker-compose logs app
   ```

3. **Reinicie a aplicação:**
   ```bash
   docker-compose restart app
   ```

### **Banco de Dados com Problema**

1. **Verifique container do banco:**
   ```bash
   docker-compose logs db
   ```

2. **Teste conexão:**
   ```bash
   docker exec digiurban_db pg_isready -U digiurban
   ```

3. **Reinicie o banco:**
   ```bash
   docker-compose restart db
   ```

### **Erro de Permissão**

1. **Corrigir permissões:**
   ```bash
   sudo chown -R digiurban:digiurban /var/www/digiurban
   ```

2. **Adicionar usuário ao grupo docker:**
   ```bash
   sudo usermod -aG docker digiurban
   ```

---

## 🔄 Atualizações Futuras

### **Como Atualizar a Aplicação**

1. **Faça suas alterações no código**
2. **Commit e push para main:**
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```
3. **O deploy acontece automaticamente!**

### **Rollback Manual**

Se precisar reverter para uma versão anterior:

```bash
# Conectar na VPS
ssh root@185.244.XXX.XXX

# Ir para diretório da aplicação
cd /var/www/digiurban

# Reverter para commit anterior
git reset --hard HEAD~1

# Reiniciar containers
docker-compose down
docker-compose up -d
```

---

## 📋 Checklist Final

### ✅ Antes do Deploy:
- [ ] Secrets configuradas no GitHub
- [ ] Chave SSH configurada
- [ ] Domínio apontando para VPS
- [ ] Acesso SSH funcionando

### ✅ Após o Deploy:
- [ ] Aplicação acessível via HTTPS
- [ ] Certificado SSL válido
- [ ] Redirecionamento HTTP → HTTPS
- [ ] Containers rodando corretamente
- [ ] Backup automático configurado

### ✅ Monitoramento:
- [ ] Health checks funcionando
- [ ] Logs sendo gerados
- [ ] SSL renovando automaticamente
- [ ] Backup rodando diariamente

---

## 🎉 Sucesso!

Se tudo deu certo, você deve ver:

- ✅ **Aplicação rodando:** https://www.digiurban.com.br
- ✅ **Deploy automático:** A cada push na branch main
- ✅ **SSL válido:** Certificado renovando automaticamente
- ✅ **Monitoramento:** Logs e métricas funcionando
- ✅ **Backup:** Banco sendo salvo diariamente
- ✅ **Segurança:** Firewall e Fail2Ban ativos

> **🚀 Parabéns! Seu DigiUrban está rodando com deploy 100% automatizado!**

---

## 📞 Suporte

Se tiver problemas:

1. **Verifique os logs** no GitHub Actions
2. **Consulte** este guia de troubleshooting
3. **Execute** os scripts de monitoramento
4. **Verifique** a documentação em `DEPLOY.md`

**Domínio da aplicação:** https://www.digiurban.com.br 