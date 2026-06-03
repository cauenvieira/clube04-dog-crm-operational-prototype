// Dados mockados do CRM Clube04

export type StatusOperacional =
  | "novo"
  | "em_atendimento"
  | "aguardando_resposta"
  | "follow_up"
  | "agendado"
  | "convertido"
  | "perdido"
  | "desqualificado"
  | "nutricao"
  | "analise_lideranca";

export type ResultadoInteracao =
  | "continuar"
  | "agendamento"
  | "sem_resposta"
  | "convertido"
  | "analise_lideranca"
  | "perdido"
  | "desqualificado"
  | "nutricao";

export type Origem =
  | "WhatsApp"
  | "Instagram"
  | "Facebook"
  | "Indicação"
  | "Fachada"
  | "Cadastro manual"
  | "Outro";

export type Atendente = "Caue" | "Etiene" | "Vinicius";

export interface InteracaoHistorico {
  id: string;
  data: string; // ISO
  resultado: ResultadoInteracao;
  observacao?: string;
  atendente: Atendente;
  statusAnterior?: StatusOperacional;
  statusNovo?: StatusOperacional;
  motivo?: string;
}

export interface Lead {
  id: string;
  tutor: string;
  pet: string;
  telefone: string;
  origem: Origem;
  atendente: Atendente;
  status: StatusOperacional;
  dataEntrada: string;
  dataProximoContato?: string;
  dataUltimoContato?: string;
  dataAgendamento?: string;
  tentativas: number;
  ultimoResultado?: ResultadoInteracao;
  observacao?: string;
  motivoPerda?: string;
  motivoDesqualificacao?: string;
  motivoNutricao?: string;
  motivoAnalise?: string;
  campanha?: string;
  raca?: string;
  peso?: string;
  servicoInteresse?: string;
  historico: InteracaoHistorico[];
}

export const STATUS_LABEL: Record<StatusOperacional, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  aguardando_resposta: "Aguardando resposta",
  follow_up: "Follow-up agendado",
  agendado: "Agendado",
  convertido: "Convertido em cliente",
  perdido: "Perdido",
  desqualificado: "Desqualificado",
  nutricao: "Nutrição / campanha",
  analise_lideranca: "Análise da liderança",
};

export const RESULTADO_LABEL: Record<ResultadoInteracao, string> = {
  continuar: "Continuar atendimento",
  agendamento: "Agendamento realizado",
  sem_resposta: "Sem resposta",
  convertido: "Cliente convertido",
  analise_lideranca: "Enviar para análise da liderança",
  perdido: "Perdido",
  desqualificado: "Desqualificado",
  nutricao: "Enviar para nutrição / campanha",
};

export const STATUS_COLORS: Record<StatusOperacional, string> = {
  novo: "bg-info/10 text-info border-info/20",
  em_atendimento: "bg-primary/10 text-primary border-primary/20",
  aguardando_resposta: "bg-warning/15 text-amber-700 border-warning/30",
  follow_up: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  agendado: "bg-success/15 text-emerald-700 border-success/25",
  convertido: "bg-emerald-600/15 text-emerald-800 border-emerald-600/25",
  perdido: "bg-muted text-muted-foreground border-border",
  desqualificado: "bg-muted text-muted-foreground border-border",
  nutricao: "bg-sky-500/10 text-sky-700 border-sky-500/20",
  analise_lideranca: "bg-destructive/10 text-destructive border-destructive/20",
};

export const ATENDENTES: Atendente[] = ["Caue", "Etiene", "Vinicius"];
export const ORIGENS: Origem[] = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Indicação",
  "Fachada",
  "Cadastro manual",
  "Outro",
];

const TUTORES = [
  "Mariana Souza", "Rafael Oliveira", "Beatriz Costa", "Lucas Pereira",
  "Camila Almeida", "Felipe Santos", "Juliana Lima", "Gustavo Ferreira",
  "Patrícia Ribeiro", "André Carvalho", "Larissa Mendes", "Thiago Barbosa",
  "Vanessa Rocha", "Bruno Cardoso", "Renata Dias", "Diego Martins",
  "Carolina Nunes", "Eduardo Pinto", "Fernanda Gomes", "Marcelo Araújo",
  "Aline Castro", "Pedro Henrique", "Tatiane Moraes", "Rodrigo Teixeira",
  "Sabrina Vieira", "Henrique Lopes", "Daniela Freitas", "Marcos Vinicius",
  "Letícia Cunha", "Vitor Andrade", "Priscila Reis", "Caio Monteiro",
  "Isabela Moura", "Leonardo Cruz", "Natália Brito", "Otávio Correia",
  "Bianca Pacheco", "Murilo Tavares", "Gabriela Sales", "Ricardo Faria",
];

const PETS = [
  "Thor", "Mel", "Luna", "Bento", "Nina", "Theo", "Bela", "Tobias",
  "Amora", "Pipoca", "Cacau", "Pingo", "Bruno", "Maya", "Apollo", "Lola",
  "Zeus", "Lara", "Bento", "Chico", "Mia", "Sol", "Rex", "Frida",
  "Spike", "Lulu", "Toby", "Cookie", "Akira", "Nala", "Bidu", "Tequila",
  "Pepita", "Ravena", "Pretinho", "Mafalda", "Joca", "Floquinho", "Pituca", "Romeu",
];

const RACAS = ["SRD", "Shih Tzu", "Maltês", "Yorkshire", "Poodle", "Golden", "Bulldog Francês", "Spitz Alemão", "Pinscher", "Lhasa Apso"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function randTel(): string {
  const ddd = 11;
  const n1 = 9;
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `(${ddd}) ${n1}${String(a).slice(0,4)}-${b}`;
}

function daysFromNow(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString();
}

function seedLeads(): Lead[] {
  // Use deterministic seeding for predictable mock
  const seed = (i: number) => {
    const tutor = TUTORES[i % TUTORES.length];
    const pet = PETS[i % PETS.length];
    return { tutor, pet };
  };

  const baseConfig: Array<Partial<Lead> & { status: StatusOperacional; offsetProx?: number; tentativas?: number }> = [
    // Para hoje (novo + em atendimento + aguardando + follow + agendado)
    { status: "novo", offsetProx: 0, tentativas: 0 },
    { status: "novo", offsetProx: 0, tentativas: 0 },
    { status: "novo", offsetProx: 0, tentativas: 0 },
    { status: "em_atendimento", offsetProx: 0, tentativas: 1 },
    { status: "em_atendimento", offsetProx: 0, tentativas: 2 },
    { status: "em_atendimento", offsetProx: 0, tentativas: 3 },
    { status: "aguardando_resposta", offsetProx: 0, tentativas: 4 },
    { status: "aguardando_resposta", offsetProx: 0, tentativas: 5 },
    { status: "follow_up", offsetProx: 0, tentativas: 2 },
    { status: "follow_up", offsetProx: 0, tentativas: 3 },
    { status: "agendado", offsetProx: 0, tentativas: 1 },
    { status: "agendado", offsetProx: 0, tentativas: 2 },
    // Vencidos 1-7
    { status: "em_atendimento", offsetProx: -2, tentativas: 4 },
    { status: "aguardando_resposta", offsetProx: -3, tentativas: 6 },
    { status: "follow_up", offsetProx: -5, tentativas: 3 },
    { status: "em_atendimento", offsetProx: -1, tentativas: 7 },
    // Backlog
    { status: "aguardando_resposta", offsetProx: -10, tentativas: 8 },
    { status: "aguardando_resposta", offsetProx: -15, tentativas: 9 },
    { status: "em_atendimento", offsetProx: -20, tentativas: 5 },
    // Sem data
    { status: "novo", tentativas: 0 },
    { status: "em_atendimento", tentativas: 2 },
    // Futuro
    { status: "follow_up", offsetProx: 2, tentativas: 1 },
    { status: "follow_up", offsetProx: 4, tentativas: 2 },
    { status: "agendado", offsetProx: 1, tentativas: 1 },
    { status: "agendado", offsetProx: 3, tentativas: 2 },
    // Análise da liderança
    { status: "analise_lideranca", offsetProx: 0, tentativas: 12, motivoAnalise: "Tentativas excedidas" },
    { status: "analise_lideranca", offsetProx: 0, tentativas: 8, motivoAnalise: "Caso sensível" },
    { status: "analise_lideranca", offsetProx: 0, tentativas: 5, motivoAnalise: "Possível falha de processo" },
    // Convertidos
    { status: "convertido", tentativas: 3 },
    { status: "convertido", tentativas: 2 },
    { status: "convertido", tentativas: 4 },
    // Perdidos
    { status: "perdido", tentativas: 5, motivoPerda: "Preço" },
    { status: "perdido", tentativas: 6, motivoPerda: "Fechou em outro lugar" },
    // Desqualificados
    { status: "desqualificado", tentativas: 1, motivoDesqualificacao: "Fora da área" },
    { status: "desqualificado", tentativas: 2, motivoDesqualificacao: "Precisa de táxi dog" },
    // Nutrição
    { status: "nutricao", tentativas: 4, motivoNutricao: "Sem urgência", campanha: "Campanha sazonal" },
    { status: "nutricao", tentativas: 3, motivoNutricao: "Ainda está avaliando", campanha: "Lista de transmissão" },
    { status: "nutricao", tentativas: 2, motivoNutricao: "Quer receber novidades", campanha: "Rebranding" },
    // Extra
    { status: "agendado", offsetProx: 0, tentativas: 1 },
    { status: "em_atendimento", offsetProx: -4, tentativas: 5 },
    { status: "follow_up", offsetProx: -8, tentativas: 6 },
  ];

  return baseConfig.map((cfg, i) => {
    const { tutor, pet } = seed(i);
    const entrada = daysFromNow(-Math.floor(Math.random() * 30) - 1);
    const ultRes: ResultadoInteracao =
      cfg.status === "convertido" ? "convertido" :
      cfg.status === "perdido" ? "perdido" :
      cfg.status === "desqualificado" ? "desqualificado" :
      cfg.status === "nutricao" ? "nutricao" :
      cfg.status === "agendado" ? "agendamento" :
      cfg.status === "aguardando_resposta" ? "sem_resposta" :
      cfg.status === "analise_lideranca" ? "analise_lideranca" :
      "continuar";

    const id = `L${String(i + 1).padStart(4, "0")}`;
    const atendente = ATENDENTES[i % 3];
    const origem = ORIGENS[i % ORIGENS.length];

    return {
      id,
      tutor,
      pet,
      telefone: randTel(),
      origem,
      atendente,
      status: cfg.status,
      dataEntrada: entrada,
      dataProximoContato: cfg.offsetProx !== undefined ? daysFromNow(cfg.offsetProx) : undefined,
      dataUltimoContato: daysFromNow(-Math.floor(Math.random() * 5) - 1),
      dataAgendamento: cfg.status === "agendado" ? daysFromNow((cfg.offsetProx ?? 0) + 2) : undefined,
      tentativas: cfg.tentativas ?? 0,
      ultimoResultado: ultRes,
      observacao: cfg.status === "perdido" ? "Tutor disse que vai pensar" :
                  cfg.status === "convertido" ? "Cliente fechou pacote mensal" :
                  cfg.status === "analise_lideranca" ? "Caso encaminhado para revisão da liderança" :
                  "Conversa em andamento via WhatsApp",
      motivoPerda: cfg.motivoPerda,
      motivoDesqualificacao: cfg.motivoDesqualificacao,
      motivoNutricao: cfg.motivoNutricao,
      motivoAnalise: cfg.motivoAnalise,
      campanha: cfg.campanha,
      raca: RACAS[i % RACAS.length],
      peso: `${(3 + (i % 20)).toFixed(1)} kg`,
      servicoInteresse: i % 3 === 0 ? "Banho relaxante" : i % 3 === 1 ? "Pacote mensal" : "Banho + tosa",
      historico: [
        {
          id: `${id}-h1`,
          data: daysFromNow(-Math.floor(Math.random() * 3) - 1),
          resultado: ultRes,
          observacao: "Registro automático mockado",
          atendente,
          statusNovo: cfg.status,
        },
      ],
    };
  });
}

const LS_KEY = "clube04_leads_v1";

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return seedLeads();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded = seedLeads();
  try { localStorage.setItem(LS_KEY, JSON.stringify(seeded)); } catch {}
  return seeded;
}

export function saveLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(leads)); } catch {}
}

export function resetLeads(): Lead[] {
  if (typeof window === "undefined") return seedLeads();
  const seeded = seedLeads();
  localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  return seeded;
}

// Helpers
export function isToday(iso?: string): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}
export function daysDiff(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  const t = new Date();
  t.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}
export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}
export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
