# Configuração SSH para Deploy Automático

## 1. Gerar Chave SSH

No seu computador local:

```bash
# Gerar nova chave SSH
ssh-keygen -t ed25519 -C "deploy@digiurban.com" -f ~/.ssh/digiurban_deploy

# Ou usando RSA (mais compatível)
ssh-keygen -t rsa -b 4096 -C "deploy@digiurban.com" -f ~/.ssh/digiurban_deploy
```

## 2. Configurar no VPS

```bash
# Copiar chave pública para o VPS
ssh-copy-id -i ~/.ssh/digiurban_deploy.pub root@SEU_VPS_IP

# Ou manualmente:
cat ~/.ssh/digiurban_deploy.pub | ssh root@SEU_VPS_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 3. Configurar Secrets no GitHub

Acesse: `GitHub Repository → Settings → Secrets and variables → Actions`

### Secrets necessários:

**VPS_HOST**
```
IP_DO_SEU_VPS
```

**VPS_USER** 
```
root
```

**VPS_SSH_KEY**
```
# Conteúdo do arquivo ~/.ssh/digiurban_deploy (chave PRIVADA)
-----BEGIN OPENSSH PRIVATE KEY-----
[copiar todo o conteúdo da chave privada aqui]
-----END OPENSSH PRIVATE KEY-----
```

**VPS_PORT** (opcional)
```
22
```

**DB_PASSWORD**
```
sua_senha_postgresql_segura
```

**JWT_SECRET**
```
uma_chave_jwt_muito_longa_e_segura_pelo_menos_64_caracteres
```

**GITHUB_TOKEN** (já configurado automaticamente pelo GitHub)

## 4. Testar Conexão

```bash
# Testar conexão SSH manual
ssh -i ~/.ssh/digiurban_deploy root@SEU_VPS_IP

# Testar com verbose para debug
ssh -v -i ~/.ssh/digiurban_deploy root@SEU_VPS_IP
```

## 5. Troubleshooting

### Erro: "Permission denied"
```bash
# Verificar permissões no VPS
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Erro: "Host key verification failed"
```bash
# Adicionar host conhecido
ssh-keyscan SEU_VPS_IP >> ~/.ssh/known_hosts
```

### Erro: "ssh: no key found"
- Verificar se a chave privada está correta no secret VPS_SSH_KEY
- Verificar se a chave começa com `-----BEGIN` e termina com `-----END`
- Não compartilhar espaços ou quebras de linha extras

## 6. Formato Correto da Chave

A chave privada deve ter este formato no secret:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAA...
[várias linhas de base64]
...
-----END OPENSSH PRIVATE KEY-----
```

**IMPORTANTE:** 
- Use a chave PRIVADA (sem .pub)
- Copie todo o conteúdo, incluindo as linhas BEGIN/END
- Não adicione espaços extras no início ou fim