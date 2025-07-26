# Credenciais de Usuários de Teste - DigiUrban2

## 🔐 Usuário Principal (Super Admin)

### 👑 Prefeito Municipal
```
Email: prefeito@municipio.gov.br
Senha: Prefeito@2024
Tipo: super_admin
Acesso: TOTAL - Todas as funcionalidades
Secretaria: Gabinete do Prefeito
```

---

## 🎯 Usuários de Teste por Hierarquia

### 👨‍💼 Administradores (admin)

#### Chefe de Gabinete
```
Email: chefe.gabinete@municipio.gov.br
Senha: ChefGab@2024
Tipo: admin
Acesso: Administrativo + Gabinete completo
Secretaria: Gabinete do Prefeito
```

#### Secretário da Saúde
```
Email: secretario.saude@municipio.gov.br
Senha: SecSaude@2024
Tipo: secretario
Acesso: Módulo Saúde + Relatórios + Correio
Secretaria: Secretaria Municipal de Saúde
```

#### Secretário da Educação
```
Email: secretario.educacao@municipio.gov.br
Senha: SecEdu@2024
Tipo: secretario
Acesso: Módulo Educação + Relatórios + Correio
Secretaria: Secretaria Municipal de Educação
```

### 👥 Coordenadores e Diretores

#### Diretor de Saúde
```
Email: diretor.saude@municipio.gov.br
Senha: DirSaude@2024
Tipo: diretor
Acesso: Módulo Saúde (sem administração)
Secretaria: Secretaria Municipal de Saúde
```

#### Coordenador de Educação
```
Email: coord.educacao@municipio.gov.br
Senha: CoordEdu@2024
Tipo: coordenador
Acesso: Módulo Educação (coordenação)
Secretaria: Secretaria Municipal de Educação
```

### 👷‍♂️ Funcionários Operacionais

#### Funcionário da Saúde
```
Email: funcionario.saude@municipio.gov.br
Senha: FuncSaude@2024
Tipo: funcionario
Acesso: Atendimentos de Saúde + Agendamentos
Secretaria: Secretaria Municipal de Saúde
```

#### Funcionário da Assistência Social
```
Email: funcionario.assistencia@municipio.gov.br
Senha: FuncAssis@2024
Tipo: funcionario
Acesso: Módulo Assistência Social (operacional)
Secretaria: Secretaria de Assistência Social
```

### 🏪 Atendentes

#### Atendente da Recepção
```
Email: atendente.recepcao@municipio.gov.br
Senha: AtendRec@2024
Tipo: atendente
Acesso: Catálogo de Serviços + Protocolos básicos
Secretaria: Gabinete do Prefeito
```

#### Atendente da Saúde
```
Email: atendente.saude@municipio.gov.br
Senha: AtendSaude@2024
Tipo: atendente
Acesso: Agendamentos + Cadastros básicos
Secretaria: Secretaria Municipal de Saúde
```

### 👥 Cidadãos

#### Cidadão Teste 1
```
Email: joao.silva@email.com
Senha: JoaoSilva@2024
Tipo: cidadao
Acesso: Portal do Cidadão apenas
CPF: 123.456.789-01
```

#### Cidadão Teste 2
```
Email: maria.santos@email.com
Senha: MariaSantos@2024
Tipo: cidadao
Acesso: Portal do Cidadão apenas
CPF: 987.654.321-00
```

---

## 📋 Processo de Criação dos Usuários

### 🔧 Método Manual (Recomendado para início)

1. **Acesse o painel Supabase:**
   - Vá em Authentication > Users > Add User

2. **Para cada usuário acima:**
   - Insira o email e senha
   - Marque "Auto Confirm User"
   - Clique em "Create User"

3. **Execute os scripts SQL:**
   - Execute os scripts na pasta `/sql/` em ordem
   - O script `12_criar_usuario_prefeito_completo.sql` configurará automaticamente o prefeito

### 🤖 Método Automatizado (Script SQL)

```sql
-- Execute após criar os usuários manualmente no Supabase
-- O script criará automaticamente os perfis e permissões
```

---

## 🔄 Fluxo de Teste Recomendado

### 1️⃣ **Teste como Prefeito (super_admin)**
- Login com credenciais do prefeito
- Verificar se todos os menus estão visíveis
- Testar criação de novo servidor
- Verificar relatórios e configurações

### 2️⃣ **Teste como Secretário (secretario)**
- Login como secretário da saúde
- Verificar se apenas módulos relevantes aparecem
- Testar funcionalidades do módulo de saúde
- Verificar se área administrativa é limitada

### 3️⃣ **Teste como Funcionário (funcionario)**
- Login como funcionário da saúde
- Verificar se menu é ainda mais restrito
- Testar operações básicas
- Confirmar que não acessa configurações

### 4️⃣ **Teste como Cidadão (cidadao)**
- Login como cidadão
- Verificar se só vê "Portal do Cidadão"
- Testar serviços públicos básicos
- Confirmar que não acessa área administrativa

---

## ⚠️ Configurações de Segurança

### 🔒 Senhas Padrão
- **Formato**: PrimeiraParte@2024
- **Política**: Mínimo 8 caracteres, maiúscula, minúscula, número, símbolo
- **Recomendação**: Altere todas as senhas no primeiro acesso

### 🚨 Importantes
- ✅ Todos os usuários têm "Auto Confirm" ativado
- ✅ Perfis são criados automaticamente pelos scripts
- ✅ Permissões são aplicadas conforme hierarquia
- ⚠️ Senhas são temporárias para testes
- ⚠️ Altere TODAS as senhas em produção

### 🔧 Personalização
- Emails podem ser alterados nos scripts SQL
- Senhas devem ser definidas no painel Supabase
- Secretarias podem ser reatribuídas conforme necessário
- Permissões são configuráveis por perfil

---

## 📊 Matriz de Acesso por Tipo de Usuário

| Funcionalidade | Cidadão | Atendente | Funcionário | Coordenador | Diretor | Secretário | Admin | Super Admin |
|---|---|---|---|---|---|---|---|---|
| Portal do Cidadão | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Catálogo de Serviços | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Meus Protocolos | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Módulos Setoriais | ❌ | 📋 | 📋 | 📋 | 📋 | 📋 | ✅ | ✅ |
| Correio Interno | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ❌ | ❌ | ❌ | 📋 | 📋 | ✅ | ✅ | ✅ |
| Administração | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 📋 | ✅ |
| Gabinete | ❌ | ❌ | ❌ | ❌ | ❌ | 📋 | 📋 | ✅ |

**Legenda:**
- ✅ Acesso total
- 📋 Acesso parcial/limitado
- ❌ Sem acesso

---

*Documento criado em ${new Date().toLocaleDateString('pt-BR')} - Credenciais de teste para desenvolvimento*