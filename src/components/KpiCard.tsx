import { type ReactNode } from "react";

export function KpiCard({
  icon, label, value, trend, accent, onClick, active,
}: {
  icon?: ReactNode; label: string; value: number | string;
  trend?: string; accent?: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border bg-card transition-all ${
        onClick ? "hover:border-primary/40 hover:shadow-sm cursor-pointer" : "cursor-default"
      } ${active ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-medium ${accent ?? "text-muted-foreground"}`}>{label}</div>
        {icon && <div className={`${accent ?? "text-muted-foreground"}`}>{icon}</div>}
      </div>
      <div className="text-2xl font-display font-bold tracking-tight">{value}</div>
      {trend && <div className="text-[11px] text-muted-foreground mt-0.5">{trend}</div>}
    </button>
  );
}
