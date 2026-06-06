import { PROXIMA_ACAO_COLORS, PROXIMA_ACAO_LABEL, type ProximaAcao } from "@/lib/lead-operational";

export function ProximaAcaoChip({ acao, className = "" }: { acao: ProximaAcao; className?: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${PROXIMA_ACAO_COLORS[acao]} ${className}`}>{PROXIMA_ACAO_LABEL[acao]}</span>;
}
