import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MockBadge } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth, getEffectivePermissions, PAPEL_LABEL, PERMISSAO_LABEL, PERMISSOES, type Papel, type Permissao } from "@/lib/auth-store";
import { addAudit } from "@/lib/audit-store";
import { toast } from "sonner";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários e Permissões · CRM Clube04" }] }),
  component: Usuarios,
});

const papeis: Papel[] = ["atendente", "lider", "administrador"];

function Usuarios() {
  const { users, currentUser, updateUser } = useAuth();

  const setPapel = (userId: string, papel: Papel) => {
    updateUser(userId, (u) => {
      const before = { papel: u.papel, permissoesExtra: u.permissoesExtra, permissoesNegadas: u.permissoesNegadas };
      const updated = { ...u, papel };
      addAudit({ action: "usuario_alterado", actorName: currentUser?.nome ?? "Usuário local", actorRole: currentUser?.papel ?? "sistema", summary: `Papel de ${u.nome} alterado para ${PAPEL_LABEL[papel]}`, before, after: updated });
      return updated;
    });
    toast.success("Papel atualizado");
  };

  const toggleActive = (userId: string) => {
    updateUser(userId, (u) => {
      const updated = { ...u, ativo: !u.ativo };
      addAudit({ action: "usuario_alterado", actorName: currentUser?.nome ?? "Usuário local", actorRole: currentUser?.papel ?? "sistema", summary: `${u.nome} ${updated.ativo ? "ativado" : "inativado"}`, before: { ativo: u.ativo }, after: { ativo: updated.ativo } });
      return updated;
    });
  };

  const toggleAtendente = (userId: string) => {
    updateUser(userId, (u) => ({ ...u, apareceComoAtendente: !u.apareceComoAtendente }));
    toast.success("Disponibilidade como atendente atualizada");
  };

  const togglePermissao = (userId: string, permissao: Permissao) => {
    updateUser(userId, (u) => {
      const efetivas = getEffectivePermissions(u);
      const tem = efetivas.includes(permissao);
      let permissoesExtra = [...u.permissoesExtra];
      let permissoesNegadas = [...u.permissoesNegadas];
      if (tem) {
        permissoesExtra = permissoesExtra.filter((p) => p !== permissao);
        if (!permissoesNegadas.includes(permissao)) permissoesNegadas.push(permissao);
      } else {
        permissoesNegadas = permissoesNegadas.filter((p) => p !== permissao);
        if (!permissoesExtra.includes(permissao)) permissoesExtra.push(permissao);
      }
      const updated = { ...u, permissoesExtra, permissoesNegadas };
      addAudit({ action: "usuario_alterado", actorName: currentUser?.nome ?? "Usuário local", actorRole: currentUser?.papel ?? "sistema", summary: `Permissão ${PERMISSAO_LABEL[permissao]} ${tem ? "removida" : "adicionada"} para ${u.nome}`, before: { permissoesExtra: u.permissoesExtra, permissoesNegadas: u.permissoesNegadas }, after: { permissoesExtra, permissoesNegadas } });
      return updated;
    });
  };

  return (
    <>
      <PageHeader title="Usuários e Permissões" subtitle="Perfis locais para testar níveis de acesso antes da implementação real." badge={<MockBadge />} />
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl border border-border bg-amber-50 text-amber-900 p-4 text-sm">
          Os usuários abaixo são mockados em localStorage. Use para validar a rotina como Atendente, Líder e Administrador.
        </div>

        {users.map((u) => {
          const efetivas = getEffectivePermissions(u);
          return (
            <div key={u.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-display font-semibold text-lg">{u.nome}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Select value={u.papel} onValueChange={(v) => setPapel(u.id, v as Papel)}>
                    <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{papeis.map((p) => <SelectItem key={p} value={p}>{PAPEL_LABEL[p]}</SelectItem>)}</SelectContent>
                  </Select>
                  <div className="flex items-center gap-2"><Label className="text-xs">Ativo</Label><Switch checked={u.ativo} onCheckedChange={() => toggleActive(u.id)} /></div>
                  <div className="flex items-center gap-2"><Label className="text-xs">Aparece como atendente</Label><Switch checked={u.apareceComoAtendente} onCheckedChange={() => toggleAtendente(u.id)} /></div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Permissões efetivas</div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {PERMISSOES.map((p) => (
                    <label key={p} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
                      <span>{PERMISSAO_LABEL[p]}</span>
                      <Switch checked={efetivas.includes(p)} onCheckedChange={() => togglePermissao(u.id, p)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
