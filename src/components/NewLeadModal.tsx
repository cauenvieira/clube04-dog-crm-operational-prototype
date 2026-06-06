import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { type Atendente, type Origem, type Lead } from "@/lib/mock-data";
import { useLeads } from "@/lib/leads-store";
import { useOperationalConfig } from "@/lib/operational-config";
import { useAuth } from "@/lib/auth-store";
import { addAudit } from "@/lib/audit-store";
import { toast } from "sonner";

function normalizeTel(s: string): string { const d = s.replace(/\D/g, ""); if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return s; }
function validTel(s: string): boolean { const d = s.replace(/\D/g, ""); return d.length === 10 || d.length === 11; }

export function NewLeadModal({ open, onClose, onOpenLead }: { open: boolean; onClose: () => void; onOpenLead?: (l: Lead) => void; }) {
  const { leads, update } = useLeads();
  const { config } = useOperationalConfig();
  const { currentUser, atendentesAtivos } = useAuth();
  const [telefone, setTelefone] = useState("");
  const [origem, setOrigem] = useState<Origem | "">("");
  const [atendente, setAtendente] = useState<Atendente | "">(currentUser?.nome ?? "");
  const [dataEntrada, setDataEntrada] = useState(new Date().toISOString().slice(0, 10));
  const [tutor, setTutor] = useState("");
  const [pet, setPet] = useState("");
  const [observacao, setObservacao] = useState("");
  const [forceCreate, setForceCreate] = useState(false);
  const duplicado = telefone && validTel(telefone) ? leads.find((l) => l.telefone.replace(/\D/g,"") === telefone.replace(/\D/g,"")) : null;
  const reset = () => { setTelefone(""); setOrigem(""); setAtendente(currentUser?.nome ?? ""); setTutor(""); setPet(""); setObservacao(""); setForceCreate(false); setDataEntrada(new Date().toISOString().slice(0, 10)); };
  const submit = (openAfter: boolean) => {
    if (!telefone || !origem || !atendente || !dataEntrada) { toast.error("Preencha os campos obrigatórios."); return; }
    if (!validTel(telefone)) { toast.error("Telefone inválido."); return; }
    if (duplicado && !forceCreate) { toast.error("Lead duplicado. Confirme abaixo para continuar."); return; }
    const id = `L${Date.now().toString().slice(-6)}`;
    const novo: Lead = { id, tutor: tutor || "Tutor sem nome", pet: pet || "Doguinho sem nome", telefone: normalizeTel(telefone), origem: origem as Origem, atendente: atendente as Atendente, status: "novo", proximaAcao: "novo_lead", dataEntrada: new Date(dataEntrada).toISOString(), dataProximoContato: new Date().toISOString(), tentativas: 0, observacao, historico: [{ id: `${id}-h1`, data: new Date().toISOString(), resultado: "continuar", atendente: atendente as Atendente, statusNovo: "novo", proximaAcaoNova: "novo_lead", observacao: "Lead cadastrado" }] };
    update((prev) => [novo, ...prev]);
    addAudit({ action: "lead_criado", actorName: currentUser?.nome ?? "Usuário local", actorRole: currentUser?.papel ?? "sistema", leadId: novo.id, leadName: `${novo.tutor} · ${novo.pet}`, summary: `Lead criado com origem ${novo.origem}` });
    toast.success("Lead cadastrado!"); reset(); onClose(); if (openAfter) setTimeout(() => onOpenLead?.(novo), 100);
  };
  return <Dialog open={open} onOpenChange={(o) => !o && onClose()}><DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto scrollbar-thin"><DialogHeader><DialogTitle>Novo lead</DialogTitle></DialogHeader><div className="space-y-3"><div><Label className="text-xs">Telefone *</Label><Input value={telefone} onChange={(e) => setTelefone(e.target.value)} onBlur={() => setTelefone(normalizeTel(telefone))} placeholder="(11) 99999-9999" className="mt-1" />{duplicado && <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><div className="flex-1"><div className="font-medium">Telefone já cadastrado para {duplicado.tutor} ({duplicado.pet})</div><div className="mt-1.5 flex gap-2"><Button size="sm" variant="outline" onClick={() => { onClose(); setTimeout(() => onOpenLead?.(duplicado), 100); }}>Abrir lead existente</Button><Button size="sm" variant="ghost" onClick={() => setForceCreate(true)}>Continuar mesmo assim</Button></div></div></div>}</div><div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Origem *</Label><Select value={origem} onValueChange={(v) => setOrigem(v as Origem)}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{config.origens.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div><div><Label className="text-xs">Atendente *</Label><Select value={atendente} onValueChange={(v) => setAtendente(v as Atendente)}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{atendentesAtivos.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select></div></div><div><Label className="text-xs">Data de entrada *</Label><Input type="date" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} className="mt-1" /></div><div className="grid grid-cols-2 gap-3"><div><Label className="text-xs">Nome do tutor</Label><Input value={tutor} onChange={(e) => setTutor(e.target.value)} className="mt-1" /></div><div><Label className="text-xs">Nome do doguinho</Label><Input value={pet} onChange={(e) => setPet(e.target.value)} className="mt-1" /></div></div><div><Label className="text-xs">Observação</Label><Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} rows={2} className="mt-1" /></div><div className="flex flex-wrap gap-2 pt-2"><Button onClick={() => submit(false)}>Salvar e voltar</Button><Button variant="outline" onClick={() => submit(true)}>Salvar e abrir acompanhamento</Button><Button variant="ghost" onClick={() => { reset(); onClose(); }}>Cancelar</Button></div></div></DialogContent></Dialog>;
}
