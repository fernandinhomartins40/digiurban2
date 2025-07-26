# 🚀 Deploy DigiUrban2

## Configuração do Deploy

### VPS e Credenciais
- **Host**: 31.97.85.98
- **Porta**: 3003
- **Usuário**: root
- **SSH Key**: Configurada na secret `VPS_PASSWORD` do repositório

### Estrutura do Deploy

#### Docker
- **Imagem**: `digiurban2-react`
- **Container**: `digiurban2-react`
- **Porta interna**: 80 (nginx)
- **Porta externa**: 3003

#### Arquivos de Deploy
- `Dockerfile` - Multi-stage build com Node.js e Nginx
- `nginx.conf` - Configuração otimizada do Nginx
- `.dockerignore` - Arquivos ignorados no build
- `.github/workflows/deploy.yml` - Pipeline automatizado

### Pipeline de Deploy

#### Triggers
- Push para branch `main`
- Workflow manual via GitHub Actions
- Mudanças em:
  - `src/**`
  - `package*.json`
  - `Dockerfile`
  - `nginx.conf`
  - `.dockerignore`
  - `.github/workflows/**`

#### Etapas
1. **Análise de Mudanças** - Detecta tipo de alterações
2. **Deploy Docker** - Build e deploy da aplicação
3. **Verificação** - Health checks automáticos
4. **Relatório** - Status final do deploy

### Tipos de Deploy
- **Full**: Mudanças em dependências (package.json)
- **Code-only**: Mudanças apenas no código
- **Config-only**: Mudanças na configuração
- **Minimal**: Mudanças em docs/workflows

### URL de Acesso
Após deploy bem-sucedido: **http://31.97.85.98:3003**

### Monitoramento
- Health checks automáticos durante deploy
- Logs de container disponíveis
- Status em tempo real via GitHub Actions

### Segurança
- SSH Key authentication
- Headers de segurança no nginx
- Container isolado
- Restart automático em falhas

### Performance
- Build multi-stage para otimização
- Compressão gzip habilitada
- Cache de assets estáticos
- Bundle size ~2.7MB (chunking recomendado)

---

## Como Usar

### 1. Configurar Secrets
No GitHub, adicione a secret `VPS_PASSWORD` com a SSH private key.

### 2. Deploy Automático
Qualquer push para `main` com mudanças relevantes dispara o deploy.

### 3. Deploy Manual
Acesse Actions → Deploy DigiUrban2 → Run workflow

### 4. Monitorar
Acompanhe os logs em tempo real na aba Actions.

---

## Troubleshooting

### Container não inicia
- Verificar logs: `docker logs digiurban2-react`
- Verificar porta: `docker ps | grep digiurban2-react`

### Build falha
- Verificar dependências no package.json
- Verificar sintaxe no código TypeScript

### Deploy falha
- Verificar conexão SSH
- Verificar espaço em disco na VPS
- Verificar status do Docker

---

*Deploy configurado para 100% de sucesso com verificações automáticas*