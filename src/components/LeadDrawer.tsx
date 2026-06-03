import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Phone, MessageCircle, Edit2, ChevronDown, Clock, User, Tag, Calendar,
  AlertTriangle, History
} from "lucide-react";
import { StatusChip } from "./StatusChip";
import {
  type Lead, type ResultadoInteracao, type StatusOperacional, RESULTADO_LABEL,
  formatDate, formatDateTime,
} from "@/lib/mock-data";
import { useLeads } from "@/lib/leads-store";
import { toast } from "sonner";

const MOTIVOS_PRAZO = [
  "Tutor pediu retorno nessa data",
  "Aguardando decisão da família",
  "Aguardando disponibilidade financeira",
  "Aguardando agenda do tutor",
  "Lead ainda está avaliando",
  "Outro",
];
const MOTIVOS_ANALISE = [
  "Caso sensível", "Lead desqualificado", "Possível falha de processo",
  "Tentativas excedidas", "Cliente reclamando", "Dúvida comercial", "Outro",
];
const MOTIVOS_PERDA = [
  "Preço", "Localização", "Fechou em outro lugar",
  "Sem disponibilidade de horário", "Sem interesse no momento",
  "Não respondeu após tentativas", "Outro",
];
const MOTIVOS_DESQ = [
  "Número inválido", "Fora da área", "Precisa de táxi dog",
  "Serviço não atendido pela unidade", "Perfil não aderente", "Duplicado",
  "Sem interesse real", "Outro",
];
const MOTIVOS_NUTRICAO = [
  "Ainda está avaliando", "Sem urgência", "Quer receber novidades",
  "Pode converter em campanha futura", "Rebranding / lista de transmissão", "Outro",
];

function resultadoParaStatus(r: ResultadoInteracao, prev: StatusOperacional): StatusOperacional {
  switch (r) {
    case "continuar": return "em_atendimento";
    case "agendamento": return "agendado";
    case "sem_resposta": return "aguardando_resposta";
    case "convertido": return "convertido";
    case "analise_lideranca": return "analise_lideranca";
    case "perdido": return "perdido";
    case "desqualificado": return "desqualificado";
    case "nutricao": return "nutricao";
    default: return prev;
  }
}

export function LeadDrawer({
  lead, open, onClose,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}) {
  const { update } = useLeads();
  const [resultado, setResultado] = useState<ResultadoInteracao | "">("");
  const [proximaData, setProximaData] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [motivoOutro, setMotivoOutro] = useState("");
  const [observacao, setObservacao] = useState("");
  const [editTutor, setEditTutor] = useState(false);
  const [tutor, setTutor] = useState("");
  const [pet, setPet] = useState("");
  const [obsGeral, setObsGeral] = useState("");

  useEffect(() => {
    if (lead) {
      setResultado("");
      setProximaData("");
      setDataAgendamento("");
      setMotivo("");
      setMotivoOutro("");
      setObservacao("");
      setTutor(lead.tutor);
      setPet(lead.pet);
      setObsGeral(lead.observacao ?? "");
      setEditTutor(false);
    }
  }, [lead?.id]);

  if (!lead) return null;

  const diasProx = (() => {
    if (!proximaData) return null;
    const d = new Date(proximaData);
    const t = new Date(); t.setHours(0,0,0,0);
    return Math.round((d.getTime() - t.getTime()) / 86400000);
  })();
  const motivoPrazoObrigatorio = resultado === "continuar" && diasProx !== null && diasProx > 7;

  const motivosList: string[] | null =
    resultado === "analise_lideranca" ? MOTIVOS_ANALISE :
    resultado === "perdido" ? MOTIVOS_PERDA :
    resultado === "desqualificado" ? MOTIVOS_DESQ :
    resultado === "nutricao" ? MOTIVOS_NUTRICAO :
    motivoPrazoObrigatorio ? MOTIVOS_PRAZO :
    null;

  const handleSubmit = () => {
    if (!resultado) { toast.error("Selecione o resultado da interação."); return; }
    if (motivosList && !motivo) { toast.error("Selecione o motivo."); return; }
    if (motivo === "Outro" && !motivoOutro) { toast.error("Descreva o motivo."); return; }
    if (resultado === "continuar" && !proximaData) { toast.error("Defina a data do próximo contato."); return; }
    if (resultado === "agendamento" && !dataAgendamento) { toast.error("Defina a data do agendamento."); return; }

    update((prev) => prev.map((l) => {
      if (l.id !== lead.id) return l;
      const novoStatus = resultadoParaStatus(resultado, l.status);
      let novasTentativas = l.tentativas;
      let proxData = l.dataProximoContato;

      if (resultado === "sem_resposta") {
        novasTentativas = l.tentativas + 1;
        if (novasTentativas >= 12) {
          // override status
          const dias = Math.min(novasTentativas, 6);
          proxData = (() => { const d = new Date(); d.setDate(d.getDate() + dias); return d.toISOString(); })();
        } else {
          const dias = Math.min(novasTentativas, 5);
          const d = new Date(); d.setDate(d.getDate() + dias);
          proxData = d.toISOString();
        }
      } else if (resultado === "continuar") {
        novasTentativas = 0;
        proxData = new Date(proximaData).toISOString();
      } else if (resultado === "agendamento") {
        novasTentativas = 0;
      } else {
        // terminal: clear próximo contato
        proxData = undefined;
      }

      const motivoFinal = motivo === "Outro" ? motivoOutro : motivo;
      const finalStatus: StatusOperacional = resultado === "sem_resposta" && novasTentativas >= 12 ? "analise_lideranca" : novoStatus;

      return {
        ...l,
        tutor, pet,
        observacao: obsGeral,
        status: finalStatus,
        tentativas: novasTentativas,
        dataProximoContato: proxData,
        dataUltimoContato: new Date().toISOString(),
        dataAgendamento: resultado === "agendamento" ? new Date(dataAgendamento).toISOString() : l.dataAgendamento,
        ultimoResultado: resultado,
        motivoPerda: resultado === "perdido" ? motivoFinal : l.motivoPerda,
        motivoDesqualificacao: resultado === "desqualificado" ? motivoFinal : l.motivoDesqualificacao,
        motivoNutricao: resultado === "nutricao" ? motivoFinal : l.motivoNutricao,
        motivoAnalise: resultado === "analise_lideranca" || finalStatus === "analise_lideranca" ? motivoFinal || "Tentativas excedidas" : l.motivoAnalise,
        historico: [
          {
            id: `${l.id}-h${l.historico.length + 1}`,
            data: new Date().toISOString(),
            resultado,
            observacao,
            atendente: l.atendente,
            statusAnterior: l.status,
            statusNovo: finalStatus,
            motivo: motivoFinal,
          },
          ...l.historico,
        ],
      };
    }));

    toast.success("Interação registrada!");
    onClose();
  };

  const saveCadastro = () => {
    update((prev) => prev.map((l) => l.id === lead.id ? { ...l, tutor, pet, observacao: obsGeral } : l));
    setEditTutor(false);
    toast.success("Cadastro atualizado");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 scrollbar-thin">
        <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {editTutor ? (
                <div className="flex gap-2 items-center">
                  <Input value={tutor} onChange={(e) => setTutor(e.target.value)} className="h-8" />
                  <Input value={pet} onChange={(e) => setPet(e.target.value)} className="h-8 max-w-32" placeholder="Pet" />
                  <Button size="sm" onClick={saveCadastro}>Salvar</Button>
                </div>
              ) : (
                <SheetTitle className="text-xl flex items-center gap-2 flex-wrap">
                  <span>{lead.tutor}</span>
                  <button onClick={() => setEditTutor(true)} className="text-muted-foreground hover:text-foreground">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm text-muted-foreground font-normal">·</span>
                  <span className="text-sm text-muted-foreground font-normal">🐾 {lead.pet}</span>
                </SheetTitle>
              )}
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <a href={`https://wa.me/55${lead.telefone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:underline">
                  <MessageCircle className="w-4 h-4" />
                  {lead.telefone}
                </a>
                <StatusChip status={lead.status} />
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Resumo compacto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoCell icon={<Tag className="w-3.5 h-3.5" />} label="Origem" value={lead.origem} />
            <InfoCell icon={<User className="w-3.5 h-3.5" />} label="Atendente" value={lead.atendente} />
            <InfoCell icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Tentativas" value={`${lead.tentativas}/12`} />
            <InfoCell icon={<Calendar className="w-3.5 h-3.5" />} label="Próximo contato" value={formatDate(lead.dataProximoContato)} />
            <InfoCell icon={<Clock className="w-3.5 h-3.5" />} label="Último contato" value={formatDate(lead.dataUltimoContato)} />
            <InfoCell icon={<Tag className="w-3.5 h-3.5" />} label="Último resultado" value={lead.ultimoResultado ? RESULTADO_LABEL[lead.ultimoResultado] : "—"} />
          </div>

          {lead.observacao && (
            <div className="p-3 rounded-lg bg-muted/60 text-sm text-muted-foreground border border-border">
              <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/70 mb-1">Última observação</div>
              {lead.observacao}
            </div>
          )}

          <Collapsible>
            <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Dados cadastrais
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Raça:</span> {lead.raca ?? "—"}</div>
              <div><span className="text-muted-foreground">Peso:</span> {lead.peso ?? "—"}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Serviço:</span> {lead.servicoInteresse ?? "—"}</div>
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Observação geral</Label>
                <Textarea value={obsGeral} onChange={(e) => setObsGeral(e.target.value)} className="mt-1" rows={2} />
                <Button size="sm" variant="outline" className="mt-2" onClick={saveCadastro}>Salvar dados</Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Registrar interação */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-base mb-4">Registrar interação</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Resultado da interação</Label>
                <Select value={resultado} onValueChange={(v) => setResultado(v as ResultadoInteracao)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(RESULTADO_LABEL) as ResultadoInteracao[]).map((k) => (
                      <SelectItem key={k} value={k}>{RESULTADO_LABEL[k]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {resultado === "sem_resposta" && (
                <div className="text-xs p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  A próxima tentativa será calculada automaticamente.
                </div>
              )}

              {resultado === "continuar" && (
                <div>
                  <Label className="text-xs">Data do próximo contato</Label>
                  <Input type="date" value={proximaData} onChange={(e) => setProximaData(e.target.value)} className="mt-1" />
                </div>
              )}

              {resultado === "agendamento" && (
                <div>
                  <Label className="text-xs">Data do agendamento</Label>
                  <Input type="datetime-local" value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)} className="mt-1" />
                </div>
              )}

              {motivosList && (
                <div>
                  <Label className="text-xs">Motivo</Label>
                  <Select value={motivo} onValueChange={setMotivo}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {motivosList.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {motivo === "Outro" && (
                    <Input className="mt-2" placeholder="Descreva o motivo..." value={motivoOutro} onChange={(e) => setMotivoOutro(e.target.value)} />
                  )}
                </div>
              )}

              <div>
                <Label className="text-xs">Observação</Label>
                <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={2} className="mt-1" placeholder="Detalhes da conversa..." />
              </div>

              <Button onClick={handleSubmit} className="w-full">Registrar interação</Button>
            </div>
          </div>

          {/* Histórico */}
          <div>
            <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
              <History className="w-4 h-4" /> Histórico
            </h3>
            <div className="space-y-2.5">
              {lead.historico.map((h) => (
                <div key={h.id} className="p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{RESULTADO_LABEL[h.resultado]}</div>
                    <div className="text-[11px] text-muted-foreground shrink-0">{formatDateTime(h.data)}</div>
                  </div>
                  {h.observacao && <div className="text-xs text-muted-foreground mt-1">{h.observacao}</div>}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>por {h.atendente}</span>
                    {h.motivo && <><span>·</span><span>{h.motivo}</span></>}
                    {h.statusNovo && <><span>·</span><StatusChip status={h.statusNovo} /></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60">
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="text-sm font-medium mt-0.5 truncate">{value}</div>
    </div>
  );
}
