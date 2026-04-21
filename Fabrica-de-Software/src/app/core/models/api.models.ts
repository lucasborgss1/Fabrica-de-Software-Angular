export type UserRole = 'admin' | 'professor';

export type Turno = 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';
export type AreaInteresse = 'DESENVOLVIMENTO_BACK_END' | 'DESENVOLVIMENTO_FRONT_END' | 'UI_UX';
export type StatusUsuario = 'ATIVO' | 'INATIVO';
export type StatusProjeto =
  | 'SOLICITADO'
  | 'APROVADO'
  | 'NAO_APROVADO'
  | 'EM_ANALISE'
  | 'FINALIZADO';
export type Demanda = 'INTERNA' | 'EXTERNA';
export type StatusGrupo = 'ATIVO' | 'INATIVO';

export interface StudentSummary {
  id: string;
  nome: string;
  matricula: string;
  emailContato: string;
  curso: string;
  statusAluno: StatusUsuario;
  nomeGrupoTrabalho: string | null;
}

export interface CreateStudentPayload {
  nome: string;
  matricula: string;
  emailContato: string;
  whatsapp: string;
  curso: string;
  turno: Turno;
  dataSelecao: string;
  linkLinkedin: string;
  linkGithub: string;
  disciplinasCursadas: string[];
  areasDeInteresse: AreaInteresse[];
  horasSemanais: number;
  senha: string;
}

export interface ProfessorSummary {
  id: string;
  nome: string;
  matricula: string;
  escola: string;
  statusProfessor: StatusUsuario;
}

export interface CreateProfessorPayload {
  nome: string;
  matricula: string;
  email: string;
  whatsapp: string;
  telefoneContato: string;
  escola: string;
  senha: string;
}

export interface ProjectSummary {
  id: string;
  nome: string;
  statusProjeto: StatusProjeto;
  dataAprovacao: string | null;
  nomeProfessorSolicitante: string;
  nomeGrupoVinculado: string | null;
}

export interface CreateProjectPayload {
  nome: string;
  objetivo: string;
  quemIraUtilizar: string;
  localUso: string;
  publicoAlvo: string;
  demanda: Demanda;
  dataInicioEstimativa: string;
  escopo: string;
}

export interface WorkgroupSummary {
  id: string;
  nomeProjeto: string;
  nomeProfessorCoordenador: string;
  nomesAlunos: string[];
  dataCriacao: string;
  statusGrupo: StatusGrupo;
}

export interface CreateWorkgroupPayload {
  projetoId: string;
  professorCoordenadorId: string;
  alunosIds: string[];
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export const areaInteresseOptions: AreaInteresse[] = [
  'DESENVOLVIMENTO_BACK_END',
  'DESENVOLVIMENTO_FRONT_END',
  'UI_UX',
];

export const turnoOptions: Turno[] = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];
export const demandaOptions: Demanda[] = ['INTERNA', 'EXTERNA'];

export function formatApiStatus(status: string | null | undefined): string {
  const labels: Record<string, string> = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo',
    SOLICITADO: 'Solicitado',
    APROVADO: 'Aprovado',
    NAO_APROVADO: 'Não aprovado',
    EM_ANALISE: 'Em análise',
    FINALIZADO: 'Finalizado',
  };

  if (!status) {
    return 'Não informado';
  }

  return labels[status] ?? status;
}

export function formatApiDate(date: string | null | undefined): string {
  if (!date) {
    return '—';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('pt-BR').format(parsedDate);
}
