import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, MockBadge } from "@/components/layout/AppLayout";
import { useAudit } from "@/lib/audit-store";
import { formatDateTime } from "@/lib/mock-data";

export const Route = createFileRoute("/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria · CRM Clube04" }] }),
  component: Auditoria,
});

const ACTION_LABEL: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  lead_criado: "Lead criado",
  lead_editado: "Lead editado",
  interacao_registrada: "Interação registrada",
  sem_resposta: "Sem resposta",
  lead_reatribuido: "Lead reatribuído",
  config_alterada: "Configuração alterada",
  usuario_alterado: "Usuário alterado",
  dados_reiniciados: "Dados reiniciados",
};

function Auditoria() {
  const { entries } = useAudit();

  return (
    <>
      <PageHeader title="Auditoria" subtitle="Registro local das ações feitas no protótipo operacional." badge={<MockBadge />} />
      <div className="px-8 py-6 space-y-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold">Data</th>
                <th className="px-3 py-2.5 text-left font-semibold">Ação</th>
                <th className="px-3 py-2.5 text-left font-semibold">Usuário</th>
                <th className="px-3 py-2.5 text-left font-semibold">Lead</th>
                <th className="px-3 py-2.5 text-left font-semibold">Resumo</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">Nenhuma ação registrada ainda.</td></tr>
              )}
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-border align-top">
                  <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{formatDateTime(entry.at)}</td>
                  <td className="px-3 py-2.5 font-medium">{ACTION_LABEL[entry.action] ?? entry.action}</td>
                  <td className="px-3 py-2.5">
                    <div>{entry.actorName}</div>
                    <div className="text-xs text-muted-foreground">{entry.actorRole}</div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{entry.leadName ?? "—"}</td>
                  <td className="px-3 py-2.5">{entry.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
