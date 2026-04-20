export type UserRole = 'admin' | 'professor';

export interface Professor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Student {
  id: string;
  name: string;
  course: string;
  shift: 'Manhã' | 'Tarde' | 'Noite';
  status: 'active' | 'inactive';
  enrollment: string;
  semester: number;
}

export type ProjectStatus = 'Em análise' | 'Aprovado' | 'Rejeitado' | 'Cancelado' | 'Em andamento';

export interface ProjectRequest {
  id: string;
  name: string;
  objective: string;
  targetUsers: string;
  usageLocation: string;
  type: 'Interno' | 'Externo';
  expectedStartDate: string;
  scope: string;
  status: ProjectStatus;
  professor: string;
  createdAt: string;
}

export interface Workgroup {
  id: string;
  projectId: string;
  projectName: string;
  coordinator: string;
  students: string[];
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export const professors: Professor[] = [
  {
    id: 'p1',
    name: 'Dr. Carlos Silva',
    email: 'carlos.silva@uni.edu',
    phone: '(11) 99999-1234',
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Dra. Ana Souza',
    email: 'ana.souza@uni.edu',
    phone: '(11) 98888-5678',
    status: 'active',
  },
  {
    id: 'p3',
    name: 'Dr. Roberto Lima',
    email: 'roberto.lima@uni.edu',
    phone: '(11) 97777-9012',
    status: 'inactive',
  },
  {
    id: 'p4',
    name: 'Dra. Fernanda Costa',
    email: 'fernanda.costa@uni.edu',
    phone: '(11) 96666-3456',
    status: 'active',
  },
  {
    id: 'p5',
    name: 'Dr. João Pereira',
    email: 'joao.pereira@uni.edu',
    phone: '(11) 95555-7890',
    status: 'active',
  },
];

export const students: Student[] = [
  {
    id: 's1',
    name: 'Lucas Oliveira',
    course: 'Ciência da Computação',
    shift: 'Manhã',
    status: 'active',
    enrollment: '2023001',
    semester: 5,
  },
  {
    id: 's2',
    name: 'Maria Santos',
    course: 'Engenharia de Software',
    shift: 'Noite',
    status: 'active',
    enrollment: '2023002',
    semester: 6,
  },
  {
    id: 's3',
    name: 'Pedro Almeida',
    course: 'Sistemas de Informação',
    shift: 'Tarde',
    status: 'active',
    enrollment: '2023003',
    semester: 4,
  },
  {
    id: 's4',
    name: 'Julia Ferreira',
    course: 'Ciência da Computação',
    shift: 'Manhã',
    status: 'inactive',
    enrollment: '2023004',
    semester: 7,
  },
  {
    id: 's5',
    name: 'Gabriel Martins',
    course: 'Engenharia de Software',
    shift: 'Noite',
    status: 'active',
    enrollment: '2023005',
    semester: 3,
  },
  {
    id: 's6',
    name: 'Camila Rodrigues',
    course: 'Sistemas de Informação',
    shift: 'Tarde',
    status: 'active',
    enrollment: '2023006',
    semester: 5,
  },
  {
    id: 's7',
    name: 'Rafael Nascimento',
    course: 'Ciência da Computação',
    shift: 'Manhã',
    status: 'active',
    enrollment: '2023007',
    semester: 8,
  },
  {
    id: 's8',
    name: 'Isabela Lima',
    course: 'Engenharia de Software',
    shift: 'Noite',
    status: 'active',
    enrollment: '2023008',
    semester: 2,
  },
];

export const projectRequests: ProjectRequest[] = [
  {
    id: 'pr1',
    name: 'Sistema de Gestão Acadêmica',
    objective: 'Automatizar processos acadêmicos',
    targetUsers: 'Alunos e professores',
    usageLocation: 'Campus principal',
    type: 'Interno',
    expectedStartDate: '2026-05-01',
    scope: 'Módulos de matrícula, notas e frequência',
    status: 'Em análise',
    professor: 'Dr. Carlos Silva',
    createdAt: '2026-04-10',
  },
  {
    id: 'pr2',
    name: 'App de Biblioteca Digital',
    objective: 'Digitalizar acervo da biblioteca',
    targetUsers: 'Comunidade acadêmica',
    usageLocation: 'Online',
    type: 'Interno',
    expectedStartDate: '2026-06-15',
    scope: 'Catálogo digital, reservas online, leitura digital',
    status: 'Aprovado',
    professor: 'Dra. Ana Souza',
    createdAt: '2026-04-05',
  },
  {
    id: 'pr3',
    name: 'Portal de Estágios',
    objective: 'Conectar alunos a empresas',
    targetUsers: 'Alunos e empresas parceiras',
    usageLocation: 'Online',
    type: 'Externo',
    expectedStartDate: '2026-07-01',
    scope: 'Cadastro de vagas, candidaturas, acompanhamento',
    status: 'Rejeitado',
    professor: 'Dr. Roberto Lima',
    createdAt: '2026-03-28',
  },
  {
    id: 'pr4',
    name: 'Sistema de Monitoria',
    objective: 'Gerenciar programa de monitoria',
    targetUsers: 'Alunos monitores e professores',
    usageLocation: 'Campus',
    type: 'Interno',
    expectedStartDate: '2026-05-20',
    scope: 'Inscrições, horários, relatórios de acompanhamento',
    status: 'Em andamento',
    professor: 'Dra. Fernanda Costa',
    createdAt: '2026-04-01',
  },
  {
    id: 'pr5',
    name: 'Plataforma de Eventos',
    objective: 'Gerenciar eventos acadêmicos',
    targetUsers: 'Organizadores e participantes',
    usageLocation: 'Online e presencial',
    type: 'Externo',
    expectedStartDate: '2026-08-01',
    scope: 'Inscrições, programação, certificados',
    status: 'Cancelado',
    professor: 'Dr. João Pereira',
    createdAt: '2026-03-15',
  },
  {
    id: 'pr6',
    name: 'App de Transporte Universitário',
    objective: 'Otimizar rotas de transporte',
    targetUsers: 'Alunos',
    usageLocation: 'Mobile',
    type: 'Interno',
    expectedStartDate: '2026-06-01',
    scope: 'Rotas, horários, rastreamento em tempo real',
    status: 'Em análise',
    professor: 'Dr. Carlos Silva',
    createdAt: '2026-04-12',
  },
];

export const workgroups: Workgroup[] = [
  {
    id: 'wg1',
    projectId: 'pr2',
    projectName: 'App de Biblioteca Digital',
    coordinator: 'Dra. Ana Souza',
    students: ['Lucas Oliveira', 'Maria Santos', 'Pedro Almeida'],
  },
  {
    id: 'wg2',
    projectId: 'pr4',
    projectName: 'Sistema de Monitoria',
    coordinator: 'Dra. Fernanda Costa',
    students: ['Gabriel Martins', 'Camila Rodrigues', 'Rafael Nascimento', 'Isabela Lima'],
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    message: "Projeto 'Sistema de Gestão Acadêmica' foi enviado para análise",
    time: 'Há 2 horas',
    read: false,
  },
  {
    id: 'n2',
    message: "Projeto 'App de Biblioteca Digital' foi aprovado",
    time: 'Há 1 dia',
    read: false,
  },
  {
    id: 'n3',
    message: "Novo grupo de trabalho criado para 'Sistema de Monitoria'",
    time: 'Há 2 dias',
    read: true,
  },
  {
    id: 'n4',
    message: "Projeto 'Portal de Estágios' foi rejeitado",
    time: 'Há 3 dias',
    read: true,
  },
  {
    id: 'n5',
    message: "Projeto 'Plataforma de Eventos' foi cancelado",
    time: 'Há 5 dias',
    read: true,
  },
];
