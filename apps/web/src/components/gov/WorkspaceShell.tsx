import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { MiraShell } from "@/components/mira/MiraShell";
import type { RoleNavItem } from "@/lib/role-config";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function WorkspaceShell({
  title,
  items,
  children,
  isAuditor,
}: {
  title?: string;
  items?: NavItem[];
  children: ReactNode;
  notifTo?: string;
  inboxTo?: string;
  isAuditor?: boolean;
}) {
  const convertedItems: RoleNavItem[] | undefined = items
    ? items.map((it, idx) => ({
        id: `nav-${idx}`,
        label: it.label,
        to: it.to,
        icon: it.icon,
        exact: it.exact,
      }))
    : undefined;

  return (
    <MiraShell title={title} items={convertedItems} isReadOnly={isAuditor}>
      {children}
    </MiraShell>
  );
}
