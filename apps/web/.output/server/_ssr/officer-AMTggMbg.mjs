import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import {
  Bt as FileSearch,
  Ct as House,
  Dn as Bell,
  F as ScrollText,
  J as OctagonAlert,
  Lt as FileText,
  X as Navigation,
  bn as ChartColumn,
  cn as ClipboardCheck,
  ft as ListChecks,
  it as Mail,
  j as Settings,
  l as Users,
  mt as LayoutDashboard,
  xn as Camera,
} from "../_libs/lucide-react.mjs";
import { l as RequireRole } from "./ui-lDSlMDlK.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-DIl7dyOY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer-AMTggMbg.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
  {
    to: "/officer/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/officer/field-visits",
    label: "Field Inspections",
    icon: Navigation,
  },
  {
    to: "/officer/applications",
    label: "Applications",
    icon: ClipboardCheck,
  },
  {
    to: "/officer/verification",
    label: "Verification Queue",
    icon: ListChecks,
  },
  {
    to: "/officer/evidence",
    label: "Evidence Vault",
    icon: Camera,
  },
  {
    to: "/officer/duplicates",
    label: "Duplicate Alerts",
    icon: OctagonAlert,
  },
  {
    to: "/officer/inbox",
    label: "Communications",
    icon: Mail,
  },
  {
    to: "/officer/citizens/C-1001",
    label: "Citizen Records",
    icon: Users,
  },
  {
    to: "/officer/families/HH-UP-0417-2291",
    label: "Family Records",
    icon: House,
  },
  {
    to: "/officer/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    to: "/schemes",
    label: "Schemes",
    icon: FileSearch,
  },
  {
    to: "/officer/reports",
    label: "Reports",
    icon: ChartColumn,
  },
  {
    to: "/officer/audit",
    label: "Audit Logs",
    icon: ScrollText,
  },
  {
    to: "/officer/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    to: "/officer/settings",
    label: "Settings",
    icon: Settings,
  },
];
function OfficerLayout() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
    role: "officer",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
      title: "Field Official Workspace",
      items: ITEMS,
      notifTo: "/officer/notifications",
      inboxTo: "/officer/inbox",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
    }),
  });
}
//#endregion
export { OfficerLayout as component };
