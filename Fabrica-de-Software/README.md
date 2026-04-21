# Fábrica de Software — Frontend Angular

Interface web para o sistema de gerenciamento da **Fábrica de Software**, desenvolvida em Angular 21. Permite que administradores e professores gerenciem projetos, grupos de trabalho, alunos e professores de forma integrada com a API REST do backend.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Autenticação e Perfis de Acesso](#autenticação-e-perfis-de-acesso)
- [Páginas e Funcionalidades](#páginas-e-funcionalidades)
- [Modelos de Dados](#modelos-de-dados)
- [Serviços](#serviços)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Configuração do Backend](#configuração-do-backend)
- [Testes](#testes)
- [Build para Produção](#build-para-produção)

---

## Visão Geral

O sistema gerencia o ciclo de vida de projetos da Fábrica de Software, desde a solicitação por um professor até a aprovação, vinculação a um grupo de trabalho e finalização. Há dois perfis de usuário com visões distintas:

- **Administrador** — acesso completo a todas as entidades do sistema.
- **Professor** — acesso restrito às suas próprias solicitações e projetos.

---

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Angular | 21.2 | Framework principal (standalone components) |
| TypeScript | 5.9 | Linguagem de programação |
| Tailwind CSS | 3.4 | Estilização utilitária com design system via CSS variables |
| Lucide Angular | 1.0 | Biblioteca de ícones |
| RxJS | 7.8 | Programação reativa / chamadas HTTP |
| Angular SSR + Express | 21.2 / 5.1 | Server-Side Rendering |
| Zone.js | 0.15 | Detecção de mudanças |

---

## Pré-requisitos

- **Node.js** >= 20
- **npm** >= 11
- **Backend da Fábrica de Software** rodando em `http://localhost:8083`

---

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:4200)
npm start

# Ou com Angular CLI diretamente
ng serve
```

A aplicação recarrega automaticamente ao detectar alterações nos arquivos-fonte.

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── app.ts                    # Componente raiz
│   ├── app.routes.ts             # Definição de rotas
│   ├── app.config.ts             # Configuração da aplicação (providers)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app-layout/       # Layout principal com sidebar e header
│   │   │   ├── app-header/       # Cabeçalho com notificações e nome do usuário
│   │   │   └── app-sidebar/      # Barra lateral com navegação por perfil
│   │   ├── page-header/          # Cabeçalho reutilizável de página
│   │   ├── status-badge/         # Badge de status colorido
│   │   └── ui/
│   │       ├── button/           # Componente de botão
│   │       └── input/            # Componente de input
│   │
│   ├── core/
│   │   ├── models/
│   │   │   └── api.models.ts     # Interfaces, types e helpers de formatação
│   │   └── services/
│   │       ├── auth.ts           # Serviço de autenticação (signals + localStorage)
│   │       └── backend-api.ts    # Cliente HTTP para a API REST
│   │
│   ├── lib/
│   │   └── mock-data.ts          # Dados mock (ex.: notificações)
│   │
│   └── pages/
│       ├── login-page/           # Tela de login
│       ├── dashboard-page/       # Painel com métricas gerais
│       ├── professors-page/      # CRUD de professores
│       ├── students-page/        # CRUD de alunos
│       ├── requests-page/        # Listagem e criação de solicitações de projeto
│       ├── request-detail-page/  # Detalhes e ações sobre uma solicitação
│       ├── projects-page/        # Projetos aprovados/em andamento
│       ├── workgroups-page/      # Criação e visualização de grupos de trabalho
│       └── not-found/            # Página 404
│
└── styles.css                    # Estilos globais e design tokens CSS
```

---

## Arquitetura

### Standalone Components
Todos os componentes são **standalone** (sem NgModule). O roteamento é lazy-loaded: cada página só é carregada quando o usuário navega até ela.

### Angular Signals
O estado local de cada página é gerenciado por **Signals** (`signal`, `computed`), evitando mutações imperativas e tornando o fluxo de dados previsível.

### Roteamento

```
/                       → redireciona para /login
/login                  → LoginPage
/dashboard              → DashboardPage        (layout autenticado)
/professors             → ProfessorsPage       (layout autenticado)
/students               → StudentsPage         (layout autenticado)
/requests               → RequestsPage         (layout autenticado)
/requests/:id           → RequestDetailPage    (layout autenticado)
/workgroups             → WorkgroupsPage       (layout autenticado)
/projects               → ProjectsPage         (layout autenticado)
**                      → NotFound
```

Todas as rotas autenticadas são filhas do componente `AppLayout`, que renderiza sidebar e header.

---

## Autenticação e Perfis de Acesso

A autenticação utiliza **HTTP Basic Auth**. As credenciais são codificadas em Base64 e enviadas no header `Authorization` de todas as requisições à API.

A sessão é persistida no `localStorage` sob a chave `fs-auth`, permitindo que o usuário permaneça autenticado após recarregar a página. O serviço `Auth` expõe signals reativos (`isLoggedIn`, `role`, `token`, `userName`) consumidos pelos componentes.

### Fluxo de Login

1. Usuário informa login e senha.
2. O frontend tenta chamar `GET /api/projetos` com as credenciais.
3. **HTTP 200** → usuário é `admin`, redirecionado ao dashboard.
4. **HTTP 403** → usuário é `professor`, redirecionado ao dashboard com perfil restrito.
5. **HTTP 401** → credenciais inválidas, exibe mensagem de erro.
6. **HTTP 0** → backend indisponível, exibe aviso de conexão.

### Menu por Perfil

| Perfil | Itens do menu |
|---|---|
| **Admin** | Dashboard, Professores, Alunos, Solicitações, Grupos de Trabalho |
| **Professor** | Dashboard, Minhas Solicitações, Meus Projetos |

---

## Páginas e Funcionalidades

### Dashboard (`/dashboard`)
Exibe métricas consolidadas em cards:
- Total de professores, alunos e grupos de trabalho
- Solicitações pendentes (SOLICITADO + EM_ANALISE)
- Projetos aprovados/finalizados e projetos não aprovados
- Listagem geral de todas as solicitações de projeto

### Professores (`/professors`) — Admin
- Listagem com busca por nome, matrícula ou escola
- Alternância entre professores ativos/inativos
- Cadastro via modal (nome, matrícula, e-mail, WhatsApp, telefone, escola, senha)
- Desativação de professor

### Alunos (`/students`) — Admin
- Listagem com busca por nome, matrícula ou curso
- Alternância entre alunos ativos/inativos
- Cadastro com campos estendidos: turno, áreas de interesse, disciplinas cursadas, horas semanais, links LinkedIn e GitHub
- Desativação de aluno

### Solicitações (`/requests`)
- **Admin:** lista todas as solicitações
- **Professor:** lista somente as suas solicitações
- Criação de nova solicitação via modal (nome, objetivo, demanda interna/externa, escopo, data estimada, etc.)
- Navegação para o detalhe de cada solicitação

### Detalhe de Solicitação (`/requests/:id`) — Admin
Exibe todos os dados do projeto e, se houver grupo vinculado, seus integrantes. Permite transições de status:

| Ação | Status Origem | Status Destino |
|---|---|---|
| Colocar em Análise | SOLICITADO | EM_ANALISE |
| Aprovar | SOLICITADO / EM_ANALISE | APROVADO |
| Cancelar | SOLICITADO / EM_ANALISE | NAO_APROVADO |

### Grupos de Trabalho (`/workgroups`) — Admin
- Listagem com projeto vinculado, coordenador e membros
- Criação de grupo: selecionar projeto aprovado, professor coordenador e alunos membros

### Projetos (`/projects`)
- **Admin:** lista todos os projetos aprovados, em análise ou finalizados
- **Professor:** lista apenas os projetos onde é o solicitante
- Exibe status e grupo de trabalho vinculado

---

## Modelos de Dados

### Tipos de Status

```typescript
type StatusProjeto  = 'SOLICITADO' | 'EM_ANALISE' | 'APROVADO' | 'NAO_APROVADO' | 'FINALIZADO';
type StatusUsuario  = 'ATIVO' | 'INATIVO';
type StatusGrupo    = 'ATIVO' | 'INATIVO';
type Demanda        = 'INTERNA' | 'EXTERNA';
type Turno          = 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
type AreaInteresse  = 'DESENVOLVIMENTO_BACK_END' | 'DESENVOLVIMENTO_FRONT_END' | 'UI_UX';
type UserRole       = 'admin' | 'professor';
```

### Principais Interfaces

| Interface | Descrição |
|---|---|
| `StudentSummary` | Resumo de aluno retornado pela API |
| `CreateStudentPayload` | Payload para cadastrar novo aluno |
| `ProfessorSummary` | Resumo de professor retornado pela API |
| `CreateProfessorPayload` | Payload para cadastrar novo professor |
| `ProjectSummary` | Resumo de projeto retornado pela API |
| `CreateProjectPayload` | Payload para solicitar novo projeto |
| `WorkgroupSummary` | Resumo de grupo de trabalho |
| `CreateWorkgroupPayload` | Payload para criar grupo de trabalho |

---

## Serviços

### `Auth` (`src/app/core/services/auth.ts`)
Gerencia a sessão. Expõe signals reativos e os métodos:
- `login(session?)` — autentica e persiste no `localStorage`
- `logout()` — encerra sessão
- `setRole(role, persist?)` — altera o perfil
- `setProfessorId(id)` — define o ID do professor logado

### `BackendApi` (`src/app/core/services/backend-api.ts`)
Encapsula todos os endpoints da API REST:

| Método | Endpoint | Descrição |
|---|---|---|
| `listStudents()` | `GET /api/alunos` | Lista alunos |
| `createStudent(payload)` | `POST /api/alunos` | Cadastra aluno |
| `deactivateStudent(id)` | `DELETE /api/alunos/:id` | Desativa aluno |
| `listProfessors()` | `GET /api/professores` | Lista professores |
| `createProfessor(payload)` | `POST /api/professores` | Cadastra professor |
| `deactivateProfessor(id)` | `DELETE /api/professores/:id` | Desativa professor |
| `listProjects()` | `GET /api/projetos` | Lista projetos |
| `listDeniedProjects()` | `GET /api/projetos/negados` | Lista projetos negados |
| `requestProject(profId, payload)` | `POST /api/projetos/solicitar/:id` | Solicita projeto |
| `analyzeProject(id)` | `PATCH /api/projetos/:id/analisar` | Coloca em análise |
| `approveProject(id)` | `PATCH /api/projetos/:id/aprovar` | Aprova projeto |
| `cancelProject(id)` | `PATCH /api/projetos/:id/cancelar` | Cancela projeto |
| `listWorkgroups()` | `GET /api/grupos` | Lista grupos |
| `createWorkgroup(payload)` | `POST /api/grupos` | Cria grupo de trabalho |

Todas as requisições incluem o header `Authorization: Basic <token>` automaticamente.

---

## Componentes Reutilizáveis

### `StatusBadge`
Badge colorido mapeado por CSS classes do design system:

| Status | Aparência |
|---|---|
| SOLICITADO / EM_ANALISE | Amarelo |
| APROVADO / FINALIZADO | Verde |
| NAO_APROVADO | Vermelho |
| ATIVO | Verde |
| INATIVO | Cinza |

### `PageHeader`
Cabeçalho padronizado com título e slot para ações.

### `AppSidebar`
Navegação lateral com itens filtrados por perfil e botão de logout.

### `AppHeader`
Cabeçalho com nome do usuário e dropdown de notificações com contador de não lidas.

### `ButtonComponent` / `InputComponent`
Componentes de formulário com estilo consistente via Tailwind.

---

## Configuração do Backend

O endereço base da API está em `src/app/core/services/backend-api.ts`:

```typescript
private readonly baseUrl = 'http://localhost:8083';
```

Para apontar para outro ambiente, altere essa constante ou externalize-a via `environment.ts`.

---

## Testes

```bash
# Executar testes unitários (execução única)
npx ng test --watch=false

# Executar em modo watch
npm test
```

Cada componente e serviço possui um arquivo `.spec.ts` correspondente.

---

## Build para Produção

```bash
npm run build
```

Os artefatos são gerados em `dist/Fabrica-de-Software/`. Para executar o servidor SSR:

```bash
npm run serve:ssr:Fabrica-de-Software
```
