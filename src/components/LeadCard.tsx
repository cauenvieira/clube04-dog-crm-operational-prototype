import { MessageCircle, PhoneOff, Clock, AlertTriangle } from "lucide-react";
import { type Lead, daysDiff, formatDate, RESULTADO_LABEL } from "@/lib/mock-data";
import { StatusChip } from "./StatusChip";
import { toast } from "sonner";
import { useLeads } from "@/lib/leads-store";

export function LeadCard({ lead, onOpen, compact = false }: { lead: Lead; onOpen: (l: Lead) => void; compact?: boolean }) {
  const { update } = useLeads();
  const diff = daysDiff(lead.dataProximoContato);
  const urgencia =
    !lead.dataProximoContato ? { label: "Sem data", color: "bg-amber-100 text-amber-800 border-amber-200" } :
    diff === 0 ? { label: "Hoje", color: "bg-primary/15 text-primary border-primary/30" } :
    diff !== null && diff < 0 && diff >= -7 ? { label: `Vencido ${Math.abs(diff)}d`, color: "bg-destructive/10 text-destructive border-destructive/25" } :
    diff !== null && diff < -7 ? { label: "Backlog", color: "bg-destructive/15 text-destructive border-destructive/30" } :
    diff !== null && diff > 0 ? { label: `Em ${diff}d`, color: "bg-muted text-muted-foreground border-border" } : null;

  const handleSemResposta = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Registrar sem resposta e calcular a próxima tentativa?")) return;
    update((prev) => prev.map((l) => {
      if (l.id !== lead.id) return l;
      const novasT = l.tentativas + 1;
      const dias = Math.min(novasT, 5);
      const d = new Date(); d.setDate(d.getDate() + dias);
      const novoStatus = novasT >= 12 ? "analise_lideranca" : "aguardando_resposta";
      return {
        ...l,
        tentativas: novasT,
        status: novoStatus,
        dataProximoContato: d.toISOString(),
        dataUltimoContato: new Date().toISOString(),
        ultimoResultado: "sem_resposta",
        historico: [{
          id: `${l.id}-h${l.historico.length+1}`,
          data: new Date().toISOString(),
          resultado: "sem_resposta",
          atendente: l.atendente,
          statusAnterior: l.status,
          statusNovo: novoStatus,
          observacao: "Sem resposta — registrado via ação rápida",
        }, ...l.historico],
      };
    }));
    toast.success(`Sem resposta registrada (${lead.tentativas + 1}/12)`);
  };

  const tel = lead.telefone.replace(/\D/g,"");

  return (
    <div
      onClick={() => onOpen(lead)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-3.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate">{lead.tutor}</div>
          <div className="text-xs text-muted-foreground truncate">🐾 {lead.pet} · {lead.telefone}</div>
        </div>
        {urgencia && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap ${urgencia.color}`}>
            {urgencia.label}
          </span>
        )}
      </div>

      {!compact && (
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground mb-2.5">
          <span className="truncate">{lead.origem} · {lead.atendente}</span>
          <span className="flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3" />
            {lead.tentativas}/12
          </span>
        </div>
      )}

      {lead.ultimoResultado && !compact && (
        <div className="text-[11px] text-muted-foreground mb-2 truncate">
          <Clock className="w-3 h-3 inline mr-1" />
          {RESULTADO_LABEL[lead.ultimoResultado]} · {formatDate(lead.dataUltimoContato)}
        </div>
      )}

      <div className="flex items-center gap-1.5 pt-2 border-t border-border/60">
        <a
          href={`https://wa.me/55${tel}`} target="_blank" rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
        <button
          onClick={handleSemResposta}
          className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-md bg-muted hover:bg-amber-50 hover:text-amber-700 text-muted-foreground transition-colors"
        >
          <PhoneOff className="w-3.5 h-3.5" /> Sem resposta
        </button>
      </div>
    </div>
  );
}
