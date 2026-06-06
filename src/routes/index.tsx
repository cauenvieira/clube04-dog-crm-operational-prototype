import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, MockBadge } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Search, SlidersHorizontal, LayoutGrid, List, CalendarClock, AlertTriangle, Inbox, CalendarX, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useLeads } from "@/lib/leads-store";
import { LeadCard } from "@/components/LeadCard";
import { LeadDrawer } from "@/components/LeadDrawer";
import { NewLeadModal } from "@/components/NewLeadModal";
import { KpiCard } from "@/components/KpiCard";
import { type Lead, isToday } from "@/lib/mock-data";
import { useOperationalConfig } from "@/lib/operational-config";
import { getLeadProximaAcao, PROXIMA_ACAO_LABEL, type ProximaAcao, classifyUrgencia } from "@/lib/lead-operational";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Mesa Operacional · CRM Clube04" }] }),
  component: MesaOperacional,
});

const COLUNAS: ProximaAcao[] = ["novo_lead", "retomar_atendimento", "fazer_follow_up", "aguardando_resposta", "registrar_agendamento", "revisar_lideranca"];
const ATIVAS: ProximaAcao[] = ["novo_lead", "retomar_atendimento", "fazer_follow_up", "aguardando_resposta", "registrar_agendamento", "revisar_lideranca"];

type Filtro = "hoje" | "vencidos" | "backlog" | "sem_data" | "lideranca" | "atendidos" | null;

function MesaOperacional() {
  const { leads } = useLeads();
  const { config } = useOperationalConfig();
  const { atendentesAtivos, can } = useAuth();
  const [view, setView] = useState<"kanban" | "lista">("kanban");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>(null);
  const [atendenteRapido, setAtendenteRapido] = useState<string>("todos");
  const [showAdv, setShowAdv] = useState(false);
  const [fOrigem, setFOrigem] = useState("todos");
  const [fAcao, setFAcao] = useState("todos");

  const counts = useMemo(() => {
    let hoje = 0, vencidos = 0, backlog = 0, semData = 0, lideranca = 0, atendidos = 0;
    leads.forEach((l) => {
      const acao = getLeadProximaAcao(l);
      const urg = classifyUrgencia(l);
      if (acao === "revisar_lideranca") lideranca++;
      if (isToday(l.dataUltimoContato)) atendidos++;
      if (!ATIVAS.includes(acao)) return;
      if (urg.tipo === "sem_data") semData++;
      if (urg.tipo === "hoje") hoje++;
      if (urg.tipo === "vencido") vencidos++;
      if (urg.tipo === "backlog") backlog++;
    });
    return { hoje, vencidos, backlog, semData, lideranca, atendidos };
  }, [leads]);

  const filtrados = useMemo(() => {
    return leads.filter((l) => {
      const acao = getLeadProximaAcao(l);
      const urg = classifyUrgencia(l);
      if (atendenteRapido !== "todos" && l.atendente !== atendenteRapido) return false;
      if (fOrigem !== "todos" && l.origem !== fOrigem) return false;
      if (fAcao !== "todos" && acao !== fAcao) return false;
      if (busca) {
        const q = busca.toLowerCase();
        if (!l.tutor.toLowerCase().includes(q) && !l.pet.toLowerCase().includes(q) && !l.telefone.includes(q)) return false;
      }
      if (filtro) {
        if (filtro === "hoje") return ATIVAS.includes(acao) && urg.tipo === "hoje";
        if (filtro === "vencidos") return ATIVAS.includes(acao) && urg.tipo === "vencido";
        if (filtro === "backlog") return ATIVAS.includes(acao) && urg.tipo === "backlog";
        if (filtro === "sem_data") return ATIVAS.includes(acao) && urg.tipo === "sem_data";
        if (filtro === "lideranca") return acao === "revisar_lideranca";
        if (filtro === "atendidos") return isToday(l.dataUltimoContato);
      }
      return COLUNAS.includes(acao);
    });
  }, [leads, busca, filtro, atendenteRapido, fOrigem, fAcao]);

  return (
    <>
      <PageHeader
        title="Mesa Operacional"
        subtitle="Leads organizados pela próxima ação: quem atender agora, quem retomar e o que revisar."
        badge={<MockBadge />}
        actions={
          <>
            <Select value={atendenteRapido} onValueChange={setAtendenteRapido}>
              <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os atendentes</SelectItem>
                {atendentesAtivos.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            {can("leads:criar") && <Button onClick={() => setOpenNew(true)} className="gap-1.5"><Plus className="w-4 h-4" />Novo lead</Button>}
          </>
        }
      />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon={<CalendarClock className="w-4 h-4" />} label="Para hoje" value={counts.hoje} accent="text-primary" onClick={() => setFiltro(filtro === "hoje" ? null : "hoje")} active={filtro === "hoje"} />
          <KpiCard icon={<AlertTriangle className="w-4 h-4" />} label="Vencidos recentes" value={counts.vencidos} accent="text-destructive" onClick={() => setFiltro(filtro === "vencidos" ? null : "vencidos")} active={filtro === "vencidos"} />
          <KpiCard icon={<Inbox className="w-4 h-4" />} label="Backlog" value={counts.backlog} accent="text-destructive" onClick={() => setFiltro(filtro === "backlog" ? null : "backlog")} active={filtro === "backlog"} />
          <KpiCard icon={<CalendarX className="w-4 h-4" />} label="Sem próximo contato" value={counts.semData} accent="text-amber-600" onClick={() => setFiltro(filtro === "sem_data" ? null : "sem_data")} active={filtro === "sem_data"} />
          <KpiCard icon={<ShieldAlert className="w-4 h-4" />} label="Análise da liderança" value={counts.lideranca} accent="text-destructive" onClick={() => setFiltro(filtro === "lideranca" ? null : "lideranca")} active={filtro === "lideranca"} />
          <KpiCard icon={<CheckCircle2 className="w-4 h-4" />} label="Atendidos hoje" value={counts.atendidos} accent="text-emerald-600" onClick={() => setFiltro(filtro === "atendidos" ? null : "atendidos")} active={filtro === "atendidos"} />
        </div>

        <div className="rounded-xl border border-border bg-card p-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por telefone, tutor ou doguinho..." className="pl-10 h-10 border-0 bg-muted/40 focus-visible:bg-background" />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAdv(!showAdv)} className="gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" /> Filtros</Button>
            <div className="flex border border-border rounded-md overflow-hidden">
              <button onClick={() => setView("kanban")} className={`px-2.5 py-1.5 text-xs flex items-center gap-1 ${view === "kanban" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}><LayoutGrid className="w-3.5 h-3.5" /> Kanban</button>
              <button onClick={() => setView("lista")} className={`px-2.5 py-1.5 text-xs flex items-center gap-1 ${view === "lista" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}><List className="w-3.5 h-3.5" /> Lista</button>
            </div>
          </div>
          <Collapsible open={showAdv}>
            <CollapsibleContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Select value={fOrigem} onValueChange={setFOrigem}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Origem" /></SelectTrigger>
                <SelectContent><SelectItem value="todos">Todas as origens</SelectItem>{config.origens.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={fAcao} onValueChange={setFAcao}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Próxima ação" /></SelectTrigger>
                <SelectContent><SelectItem value="todos">Todas as ações</SelectItem>{COLUNAS.map((a) => <SelectItem key={a} value={a}>{PROXIMA_ACAO_LABEL[a]}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="date" className="h-9" placeholder="Próximo contato" />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {view === "kanban" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin -mx-2 px-2">
            {COLUNAS.map((col) => {
              const itens = filtrados.filter((l) => getLeadProximaAcao(l) === col);
              return (
                <div key={col} className="w-72 shrink-0">
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{PROXIMA_ACAO_LABEL[col]}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{itens.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 min-h-[200px]">
                    {itens.length === 0 ? <div className="text-xs text-muted-foreground/60 text-center py-8 rounded-lg border border-dashed border-border">Vazio</div> : itens.map((l) => <LeadCard key={l.id} lead={l} onOpen={setSelected} />)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">Nenhum lead encontrado.</div>}
            {filtrados.map((l) => <LeadCard key={l.id} lead={l} onOpen={setSelected} />)}
          </div>
        )}
      </div>

      <LeadDrawer lead={selected} open={!!selected} onClose={() => setSelected(null)} />
      <NewLeadModal open={openNew} onClose={() => setOpenNew(false)} onOpenLead={setSelected} />
    </>
  );
}
