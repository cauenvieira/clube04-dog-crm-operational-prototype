import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Users, ShieldCheck, MessageSquare, Settings, PawPrint, LogOut, UserCog, ClipboardList } from "lucide-react";
import { useAuth, PAPEL_LABEL, type Permissao } from "@/lib/auth-store";
import { addAudit } from "@/lib/audit-store";

const groups: Array<{ label: string; items: Array<{ to: string; label: string; icon: typeof LayoutGrid; permission?: Permissao }> }> = [
  {
    label: "Operação",
    items: [
      { to: "/", label: "Mesa Operacional", icon: LayoutGrid, permission: "leads:ver" },
      { to: "/base", label: "Base de Leads", icon: Users, permission: "leads:ver" },
      { to: "/analise", label: "Análise da Liderança", icon: ShieldCheck, permission: "lideranca:revisar" },
    ],
  },
  {
    label: "Apoio",
    items: [
      { to: "/mensagens", label: "Modelos de Mensagem", icon: MessageSquare, permission: "mensagens:gerenciar" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/usuarios", label: "Usuários e Permissões", icon: UserCog, permission: "usuarios:gerenciar" },
      { to: "/configuracoes", label: "Configurações Operacionais", icon: Settings, permission: "config:ver" },
      { to: "/auditoria", label: "Auditoria", icon: ClipboardList, permission: "auditoria:ver" },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { currentUser, logout, can } = useAuth();

  const handleLogout = () => {
    if (currentUser) addAudit({ action: "logout", actorName: currentUser.nome, actorRole: currentUser.papel, summary: "Logout local" });
    logout();
  };

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-base leading-tight">Clube04 CRM</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Protótipo operacional</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-5">
        {groups.map((g) => {
          const visibleItems = g.items.filter((item) => !item.permission || can(item.permission));
          if (!visibleItems.length) return null;
          return (
            <div key={g.label}>
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {g.label}
              </div>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                            : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border space-y-3">
        {currentUser && (
          <div>
            <div className="text-sm font-medium truncate">{currentUser.nome}</div>
            <div className="text-[11px] text-sidebar-foreground/60">{PAPEL_LABEL[currentUser.papel]}</div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span>Mock local</span>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-lg border border-sidebar-border px-3 py-2 text-xs hover:bg-sidebar-accent transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  );
}
