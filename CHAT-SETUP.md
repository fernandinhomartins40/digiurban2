
# Configuração do Sistema de Chat

## Pré-requisitos

1. **PostgreSQL** instalado e executando
2. **Node.js** (versão 16 ou superior)
3. **npm** ou **yarn**

## Configuração Rápida

### 1. Configurar Banco de Dados

```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres createdb municipal_chat

# Criar usuário (opcional)
sudo -u postgres createuser --interactive
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
# DATABASE_URL=postgres://username:password@localhost:5432/municipal_chat
```

### 3. Instalar Dependências e Inicializar

```bash
# Instalar dependências
npm install

# Configurar e inicializar banco
npm run setup

# Iniciar desenvolvimento (frontend + backend)
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia frontend e backend simultaneamente
- `npm run dev:frontend` - Apenas frontend (porta 8080)
- `npm run dev:server` - Apenas backend (porta 5000)
- `npm run init-db` - Inicializa tabelas do banco
- `npm run setup` - Configuração completa

## Estrutura do Sistema

### Frontend
- **React** com **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes

### Backend
- **Express.js** com **TypeScript**
- **PostgreSQL** como banco de dados
- **CORS** habilitado para desenvolvimento

### APIs Disponíveis
- `GET /api/health` - Status do servidor
- `GET /api/chat/rooms` - Lista salas de chat
- `GET /api/chat/rooms/:id/messages` - Mensagens da sala
- `POST /api/chat/rooms/:id/messages` - Enviar mensagem

## Solução de Problemas

### Erro "Failed to fetch rooms"
1. Verificar se PostgreSQL está executando
2. Confirmar DATABASE_URL no arquivo .env
3. Executar `npm run init-db` para criar tabelas
4. Verificar se backend está na porta 5000

### Erro de conexão com banco
1. Testar conexão: `psql -d municipal_chat`
2. Verificar usuário e senha no DATABASE_URL
3. Confirmar que banco existe

### Frontend não conecta com backend
1. Verificar proxy no vite.config.ts
2. Confirmar backend na porta 5000
3. Verificar CORS no servidor

## Desenvolvimento

### Estrutura de Arquivos
```
src/
├── server/          # Backend Express
│   ├── api/         # Rotas da API
│   ├── db.ts        # Configuração PostgreSQL
│   └── index.ts     # Servidor principal
├── hooks/           # React Hooks
├── types/           # Definições TypeScript
└── pages/           # Páginas React
```

### Adicionando Novas Funcionalidades
1. Criar tipos em `src/types/`
2. Adicionar rotas backend em `src/server/api/`
3. Criar hooks para frontend em `src/hooks/`
4. Implementar UI em `src/pages/` ou componentes
