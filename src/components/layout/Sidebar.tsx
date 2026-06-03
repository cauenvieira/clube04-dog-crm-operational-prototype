import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid, Users, ShieldCheck, BarChart3, FileText,
  Megaphone, Sparkles, MessageSquare, Image as ImageIcon, Bot, Settings, PawPrint
} from "lucide-react";

const groups = [
  {
    label: "Operação",
    items: [
      { to: "/", label: "Mesa Operacional", icon: LayoutGrid },
      { to: "/base", label: "Base de Leads", icon: Users },
      { to: "/analise", label: "Análise da Liderança", icon: ShieldCheck },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/dashboard", label: "Dashboard de Leads", icon: BarChart3 },
      { to: "/resumo", label: "Resumo Diário", icon: FileText },
    ],
  },
  {
    label: "Estratégia",
    items: [
      { to: "/nutricao", label: "Nutrição e Campanhas", icon: Megaphone },
      { to: "/oportunidades", label: "Oportunidades", icon: Sparkles },
    ],
  },
  {
    label: "Futuro",
    items: [
      { to: "/mensagens", label: "Biblioteca de Mensagens", icon: MessageSquare },
      { to: "/midias", label: "Biblioteca de Mídias", icon: ImageIcon },
      { to: "/ia", label: "Assistente IA", icon: Bot },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 border-r border-sidebar-border">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-base leading-tight">Clube04 CRM</div>
            <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Mogi das Cruzes</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {g.label}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
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
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <span>Modo mockup ativo</span>
        </div>
      </div>
    </aside>
  );
}
