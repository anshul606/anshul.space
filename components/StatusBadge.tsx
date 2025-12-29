import { ProjectStatus } from "@/types/project";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  live: {
    label: "Live",
    dotColor: "bg-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-500",
  },
  wip: {
    label: "WIP",
    dotColor: "bg-yellow-500",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-500",
  },
  archived: {
    label: "Archived",
    dotColor: "bg-gray-500",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-500",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
