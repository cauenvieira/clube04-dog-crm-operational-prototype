import type { ProximaAcao } from "./lead-operational";

export type StatusOperacional = "novo" | "em_atendimento" | "aguardando_resposta" | "follow_up" | "agendado" | "convertido" | "perdido" | "desqualificado" | "nutricao" | "analise_lideranca";
export type ResultadoInteracao = "continuar" | "follow_up_agendado" | "agendamento" | "sem_resposta" | "convertido" | "analise_lideranca" | "perdido" | "desqualificado" | "nutricao";
export type Origem = string;
export type Atendente = string;

export interface InteracaoHistorico {
  id: string;
  data: string;
  resultado: ResultadoInteracao;
  observacao?: string;
  atendente: Atendente;
  statusAnterior?: StatusOperacional;
  statusNovo?: StatusOperacional;
  proximaAcaoAnterior?: ProximaAcao;
  proximaAcaoNova?: ProximaAcao;
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
  proximaAcao?: ProximaAcao;
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
  novo: "Novo", em_atendimento: "Em atendimento", aguardando_resposta: "Aguardando resposta", follow_up: "Follow-up agendado", agendado: "Agendado", convertido: "Convertido em cliente", perdido: "Perdido", desqualificado: "Desqualificado", nutricao: "Nutrição / campanha", analise_lideranca: "Análise da liderança",
};
export const RESULTADO_LABEL: Record<ResultadoInteracao, string> = {
  continuar: "Continuar atendimento", follow_up_agendado: "Follow-up agendado", agendamento: "Agendamento realizado", sem_resposta: "Sem resposta", convertido: "Cliente convertido", analise_lideranca: "Enviar para análise da liderança", perdido: "Perdido", desqualificado: "Desqualificado", nutricao: "Enviar para nutrição / campanha",
};
export const STATUS_COLORS: Record<StatusOperacional, string> = {
  novo: "bg-info/10 text-info border-info/20", em_atendimento: "bg-primary/10 text-primary border-primary/20", aguardando_resposta: "bg-warning/15 text-amber-700 border-warning/30", follow_up: "bg-purple-500/10 text-purple-700 border-purple-500/20", agendado: "bg-success/15 text-emerald-700 border-success/25", convertido: "bg-emerald-600/15 text-emerald-800 border-emerald-600/25", perdido: "bg-muted text-muted-foreground border-border", desqualificado: "bg-muted text-muted-foreground border-border", nutricao: "bg-sky-500/10 text-sky-700 border-sky-500/20", analise_lideranca: "bg-destructive/10 text-destructive border-destructive/20",
};

export const ATENDENTES: Atendente[] = ["Cauê", "Etiene", "Atendente WhatsApp"];
export const ORIGENS: Origem[] = ["Meta Ads", "WhatsApp", "Instagram orgânico", "Facebook", "Google", "Indicação", "Fachada", "Evento/ação local", "Cadastro manual", "Outro"];

const TUTORES = ["Mariana Souza", "Rafael Oliveira", "Beatriz Costa", "Lucas Pereira", "Camila Almeida", "Felipe Santos", "Juliana Lima", "Gustavo Ferreira", "Patrícia Ribeiro", "André Carvalho", "Larissa Mendes", "Thiago Barbosa", "Vanessa Rocha", "Bruno Cardoso", "Renata Dias", "Diego Martins", "Carolina Nunes"];
const PETS = ["Thor", "Mel", "Luna", "Bento", "Nina", "Theo", "Bela", "Tobias", "Amora", "Pipoca", "Cacau", "Pingo", "Maya", "Apollo", "Lola", "Zeus", "Frida"];
const RACAS = ["SRD", "Shih Tzu", "Maltês", "Yorkshire", "Poodle", "Golden", "Bulldog Francês", "Spitz Alemão", "Pinscher", "Lhasa Apso"];
function randTel(i: number): string { const a = 90000 + i * 137; const b = 1000 + i * 73; return `(11) ${String(a).slice(0,5)}-${String(b).slice(0,4)}`; }
function daysFromNow(d: number): string { const date = new Date(); date.setDate(date.getDate() + d); return date.toISOString(); }

function makeLead(i: number, cfg: Partial<Lead> & { status: StatusOperacional; proximaAcao: ProximaAcao; offsetProx?: number }): Lead {
  const id = `L${String(i + 1).padStart(4, "0")}`;
  const resultado: ResultadoInteracao = cfg.status === "convertido" ? "convertido" : cfg.status === "perdido" ? "perdido" : cfg.status === "desqualificado" ? "desqualificado" : cfg.status === "nutricao" ? "nutricao" : cfg.status === "agendado" ? "agendamento" : cfg.status === "aguardando_resposta" ? "sem_resposta" : cfg.status === "analise_lideranca" ? "analise_lideranca" : cfg.proximaAcao === "fazer_follow_up" ? "follow_up_agendado" : "continuar";
  const base: Lead = {
    id, tutor: TUTORES[i % TUTORES.length], pet: PETS[i % PETS.length], telefone: randTel(i), origem: ORIGENS[i % ORIGENS.length], atendente: ATENDENTES[i % ATENDENTES.length], status: cfg.status, proximaAcao: cfg.proximaAcao,
    dataEntrada: daysFromNow(-Math.floor(i % 28) - 1), dataProximoContato: cfg.offsetProx !== undefined ? daysFromNow(cfg.offsetProx) : undefined, dataUltimoContato: daysFromNow(-Math.floor(i % 5) - 1), dataAgendamento: cfg.status === "agendado" ? daysFromNow((cfg.offsetProx ?? 0) + 2) : undefined,
    tentativas: cfg.tentativas ?? 0, ultimoResultado: resultado, observacao: cfg.observacao ?? "Registro inicial do protótipo operacional", motivoPerda: cfg.motivoPerda, motivoDesqualificacao: cfg.motivoDesqualificacao, motivoNutricao: cfg.motivoNutricao, motivoAnalise: cfg.motivoAnalise, campanha: cfg.campanha,
    raca: RACAS[i % RACAS.length], peso: `${(3 + (i % 20)).toFixed(1)} kg`, servicoInteresse: i % 3 === 0 ? "Banho relaxante" : i % 3 === 1 ? "Pacote mensal" : "Banho + tosa",
    historico: [{ id: `${id}-h1`, data: daysFromNow(-Math.floor(i % 3) - 1), resultado, observacao: "Registro automático mockado", atendente: ATENDENTES[i % ATENDENTES.length], statusNovo: cfg.status, proximaAcaoNova: cfg.proximaAcao }],
  };
  return { ...base, ...cfg };
}

function seedLeads(): Lead[] {
  const configs: Array<Partial<Lead> & { status: StatusOperacional; proximaAcao: ProximaAcao; offsetProx?: number }> = [
    { status: "novo", proximaAcao: "novo_lead", offsetProx: 0 }, { status: "novo", proximaAcao: "novo_lead", offsetProx: 0 },
    { status: "em_atendimento", proximaAcao: "retomar_atendimento", offsetProx: 0, tentativas: 1 }, { status: "em_atendimento", proximaAcao: "retomar_atendimento", offsetProx: -2, tentativas: 3 }, { status: "em_atendimento", proximaAcao: "retomar_atendimento", tentativas: 2 },
    { status: "follow_up", proximaAcao: "fazer_follow_up", offsetProx: 0, tentativas: 1 }, { status: "follow_up", proximaAcao: "fazer_follow_up", offsetProx: 2, tentativas: 2 },
    { status: "aguardando_resposta", proximaAcao: "aguardando_resposta", offsetProx: 0, tentativas: 4 }, { status: "aguardando_resposta", proximaAcao: "aguardando_resposta", offsetProx: -3, tentativas: 6 }, { status: "aguardando_resposta", proximaAcao: "retomar_atendimento", offsetProx: -12, tentativas: 9 },
    { status: "analise_lideranca", proximaAcao: "revisar_lideranca", offsetProx: 0, tentativas: 12, motivoAnalise: "Tentativas excedidas" }, { status: "analise_lideranca", proximaAcao: "revisar_lideranca", offsetProx: 0, tentativas: 5, motivoAnalise: "Caso sensível" },
    { status: "agendado", proximaAcao: "registrar_agendamento", offsetProx: 1, tentativas: 1 }, { status: "convertido", proximaAcao: "sem_proxima_acao", tentativas: 3, observacao: "Cliente fechou pacote mensal" },
    { status: "perdido", proximaAcao: "sem_proxima_acao", tentativas: 5, motivoPerda: "Preço" }, { status: "desqualificado", proximaAcao: "sem_proxima_acao", tentativas: 1, motivoDesqualificacao: "Precisa de táxi dog" }, { status: "nutricao", proximaAcao: "sem_proxima_acao", tentativas: 2, motivoNutricao: "Quer receber novidades", campanha: "Lista de transmissão" },
  ];
  return configs.map((cfg, i) => makeLead(i, cfg));
}

const LS_KEY = "clube04_leads_v2_operational";
export function loadLeads(): Lead[] { if (typeof window === "undefined") return seedLeads(); try { const raw = localStorage.getItem(LS_KEY); if (raw) return JSON.parse(raw); } catch {} const seeded = seedLeads(); try { localStorage.setItem(LS_KEY, JSON.stringify(seeded)); } catch {} return seeded; }
export function saveLeads(leads: Lead[]): void { if (typeof window === "undefined") return; try { localStorage.setItem(LS_KEY, JSON.stringify(leads)); } catch {} }
export function resetLeads(): Lead[] { if (typeof window === "undefined") return seedLeads(); const seeded = seedLeads(); localStorage.setItem(LS_KEY, JSON.stringify(seeded)); return seeded; }
export function isToday(iso?: string): boolean { if (!iso) return false; const d = new Date(iso); const t = new Date(); return d.toDateString() === t.toDateString(); }
export function daysDiff(iso?: string): number | null { if (!iso) return null; const d = new Date(iso); const t = new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); return Math.round((d.getTime() - t.getTime()) / 86400000); }
export function formatDate(iso?: string): string { if (!iso) return "—"; return new Date(iso).toLocaleDateString("pt-BR"); }
export function formatDateTime(iso?: string): string { if (!iso) return "—"; return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
