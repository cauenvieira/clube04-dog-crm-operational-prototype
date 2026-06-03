import { STATUS_COLORS, STATUS_LABEL, type StatusOperacional } from "@/lib/mock-data";

export function StatusChip({ status, className = "" }: { status: StatusOperacional; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${STATUS_COLORS[status]} ${className}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
