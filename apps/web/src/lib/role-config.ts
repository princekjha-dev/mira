import {
  Home,
  ClipboardList,
  Users,
  FileText,
  Gift,
  Mail,
  Bell,
  Settings,
  User,
  HelpCircle,
  Activity,
  Navigation,
  Camera,
  AlertOctagon,
  FileCheck2,
  AlertTriangle,
  Flag,
  ScrollText,
  Scale,
  Users2,
  BarChart3,
  DownloadCloud,
  Building2,
  Workflow,
  ListTree,
  Link2,
  Search,
  CheckCircle2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./app-state";

export interface RoleNavItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  exact?: boolean;
  section?: "WORKSPACE" | "SERVICES" | "MY CASE" | "COMMUNICATION" | "OPERATIONS" | "AUDIT" | "ACCOUNT";
  badge?: "unreadMessages" | "unreadNotifications" | "pendingVerification" | "mismatches";
}

export interface RoleConfig {
  id: Role;
  label: string;
  workspaceTitle: string;
  subtitle: string;
  defaultIdentity: {
    name: string;
    designation: string;
    organization: string;
    idBadge: string;
  };
  demoEmail: string;
  permissions: string[];
  isReadOnly?: boolean;
  navItems: RoleNavItem[];
  aiGuidance: string;
  primaryDashboardUrl: string;
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  citizen: {
    id: "citizen",
    label: "Citizen / Applicant",
    workspaceTitle: "Citizen Workspace",
    subtitle: "Public Records, Household & Benefits",
    defaultIdentity: {
      name: "Rajesh Sharma",
      designation: "Head of Household",
      organization: "Sharma Family (MIRA-FAM-10482)",
      idBadge: "C-1001",
    },
    demoEmail: "demo.citizen@mira.demo",
    permissions: ["profile:read", "household:read", "schemes:read", "eligibility:read", "applications:read", "applications:create", "documents:read", "documents:upload", "benefits:read", "notifications:read"],
    primaryDashboardUrl: "/citizen/dashboard",
    aiGuidance: "Assisting citizen with household records, scheme eligibility criteria, application status tracking, and required documentation.",
    navItems: [
      { id: "dashboard", label: "Dashboard", to: "/citizen/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "family", label: "Family360", to: "/citizen/family", icon: Users, section: "WORKSPACE" },
      { id: "schemes", label: "Schemes & Benefits", to: "/schemes", icon: Search, section: "WORKSPACE" },
      { id: "eligibility", label: "Eligibility", to: "/eligibility", icon: ListTree, section: "SERVICES" },
      { id: "applications", label: "Applications", to: "/citizen/applications", icon: ClipboardList, section: "WORKSPACE" },
      { id: "documents", label: "Documents", to: "/citizen/documents", icon: FileText, section: "WORKSPACE" },
      { id: "notifications", label: "Notifications", to: "/citizen/notifications", icon: Bell, badge: "unreadNotifications", section: "COMMUNICATION" },
      { id: "profile", label: "Profile", to: "/citizen/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  verifier: {
    id: "verifier",
    label: "Verification Officer",
    workspaceTitle: "Verification Workstation",
    subtitle: "High-Density Cross-Registry Determination",
    defaultIdentity: {
      name: "Vikram Malhotra",
      designation: "Senior Verification Officer (Grade II)",
      organization: "Directorate of Public Verification, UP",
      idBadge: "VER-UP-4029",
    },
    demoEmail: "demo.verifier@mira.demo",
    permissions: ["profile:read", "applications:read", "verification:read", "verification:write", "documents:read", "evidence:write", "field-visits:write", "notifications:read"],
    primaryDashboardUrl: "/verifier/dashboard",
    aiGuidance: "Analyzing registry cross-matches (Bhulekh, UIDAI, NFSA), detecting anomalies, summarizing household evidence, and checking statutory tolerances.",
    navItems: [
      { id: "overview", label: "Dashboard", to: "/verifier/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "queue", label: "Assigned Cases", to: "/verifier/queue", icon: ClipboardList, badge: "pendingVerification", section: "WORKSPACE" },
      { id: "mismatches", label: "Verification", to: "/verifier/mismatches", icon: ShieldCheck, badge: "mismatches", section: "WORKSPACE" },
      { id: "field", label: "Field Work", to: "/verifier/field-visits", icon: Navigation, section: "WORKSPACE" },
      { id: "documents", label: "Documents", to: "/verifier/documents", icon: FileCheck2, section: "WORKSPACE" },
      { id: "evidence", label: "Evidence", to: "/verifier/evidence", icon: Camera, section: "WORKSPACE" },
      { id: "notifications", label: "Notifications", to: "/verifier/inbox", icon: Bell, badge: "unreadNotifications", section: "COMMUNICATION" },
      { id: "profile", label: "Profile", to: "/verifier/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  officer: {
    id: "officer",
    label: "Field Official",
    workspaceTitle: "Field Operational Workspace",
    subtitle: "On-Site Physical Verification & Ingestion",
    defaultIdentity: {
      name: "Ravi Kumar",
      designation: "Field Verification Officer",
      organization: "Chandauli Rural Cluster Inspection Unit",
      idBadge: "FLD-CD-108",
    },
    demoEmail: "officer@mira.local",
    permissions: ["profile:read", "applications:read", "verification:write", "documents:read", "evidence:write", "field-visits:write", "notifications:read"],
    primaryDashboardUrl: "/officer/dashboard",
    aiGuidance: "Assisting field official with daily route scheduling, geotagged dwelling inspections, offline checklist sync, and biometric presence confirmation.",
    navItems: [
      { id: "dashboard", label: "Dashboard", to: "/officer/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "applications", label: "Assigned Cases", to: "/officer/applications", icon: ClipboardList, section: "WORKSPACE" },
      { id: "visits", label: "Field Visits", to: "/officer/field-visits", icon: Navigation, section: "WORKSPACE" },
      { id: "family360", label: "Households", to: "/officer/family360", icon: Users, section: "WORKSPACE" },
      { id: "queue", label: "Applications", to: "/officer/verification", icon: ShieldCheck, section: "WORKSPACE" },
      { id: "documents", label: "Documents", to: "/officer/documents", icon: FileText, section: "WORKSPACE" },
      { id: "schemes", label: "Schemes & Entitlements", to: "/schemes", icon: Search, section: "SERVICES" },
      { id: "inbox", label: "Communications", to: "/officer/inbox", icon: Mail, badge: "unreadMessages", section: "COMMUNICATION" },
      { id: "notifications", label: "Notifications", to: "/officer/notifications", icon: Bell, badge: "unreadNotifications", section: "COMMUNICATION" },
      { id: "audit", label: "Audit Logs", to: "/officer/audit", icon: ScrollText, section: "COMMUNICATION" },
      { id: "profile", label: "Profile", to: "/officer/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  scheme: {
    id: "scheme",
    label: "Scheme Officer",
    workspaceTitle: "Scheme Determination Console",
    subtitle: "Program Eligibility & Statutory Rules",
    defaultIdentity: {
      name: "Sunita Verma",
      designation: "Chief Welfare Scheme Officer",
      organization: "Ministry of Rural Housing & Social Welfare",
      idBadge: "SCH-DIR-881",
    },
    demoEmail: "demo.scheme@mira.demo",
    permissions: ["profile:read", "schemes:read", "schemes:write", "eligibility:read", "eligibility:write", "applications:read", "decisions:write", "reports:read", "notifications:read"],
    primaryDashboardUrl: "/officer/dashboard",
    aiGuidance: "Evaluating scheme-level eligibility matrices, cross-scheme duplication checks, budget allocation limits, and statutory sanction rules.",
    navItems: [
      { id: "dashboard", label: "Dashboard", to: "/officer/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "schemes", label: "Schemes", to: "/department/schemes", icon: Search, section: "WORKSPACE" },
      { id: "rules", label: "Eligibility Rules", to: "/department/rules", icon: ListTree, section: "WORKSPACE" },
      { id: "applications", label: "Applications", to: "/department/applications", icon: ClipboardList, section: "WORKSPACE" },
      { id: "decisions", label: "Decisions", to: "/department/workflow", icon: Scale, section: "WORKSPACE" },
      { id: "reports", label: "Reports", to: "/department/reports", icon: BarChart3, section: "OPERATIONS" },
      { id: "notifications", label: "Notifications", to: "/department/notifications", icon: Bell, badge: "unreadNotifications", section: "OPERATIONS" },
      { id: "profile", label: "Profile", to: "/department/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  supervisor: {
    id: "supervisor",
    label: "Supervisor",
    workspaceTitle: "Supervisory Operations Console",
    subtitle: "Escalations, Complex Cases & Team SLA",
    defaultIdentity: {
      name: "Dr. Alok Nath",
      designation: "Regional Joint Secretary / Supervisory Magistrate",
      organization: "Welfare Oversight & Dispute Resolution Commission",
      idBadge: "SUP-DIV-004",
    },
    demoEmail: "demo.supervisor@mira.demo",
    permissions: ["profile:read", "applications:read", "escalations:read", "decisions:review", "officers:read", "reports:read", "notifications:read"],
    primaryDashboardUrl: "/verifier/dashboard",
    aiGuidance: "Advising supervisor on team throughput, SLA breach risks, legal split adjudications, and secondary escalation reviews.",
    navItems: [
      { id: "dashboard", label: "Dashboard", to: "/verifier/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "queue", label: "Review Queue", to: "/verifier/queue", icon: ClipboardList, section: "WORKSPACE" },
      { id: "escalations", label: "Escalations", to: "/verifier/escalations", icon: Flag, section: "WORKSPACE" },
      { id: "decisions", label: "Decisions", to: "/department/workflow", icon: Scale, section: "WORKSPACE" },
      { id: "officers", label: "Officers", to: "/department/departments", icon: Users2, section: "OPERATIONS" },
      { id: "reports", label: "Reports", to: "/department/reports", icon: BarChart3, section: "OPERATIONS" },
      { id: "notifications", label: "Notifications", to: "/verifier/inbox", icon: Bell, badge: "unreadNotifications", section: "OPERATIONS" },
      { id: "profile", label: "Profile", to: "/verifier/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  auditor: {
    id: "auditor",
    label: "Auditor",
    workspaceTitle: "Forensic Audit Authority",
    subtitle: "Read-Only Cryptographic Inspection (ISO/IEC 27001)",
    defaultIdentity: {
      name: "Priya Nair",
      designation: "Senior Forensic Auditor",
      organization: "Comptroller & Auditor General (CAG) Directorate",
      idBadge: "CAG-AUD-2026",
    },
    demoEmail: "demo.auditor@mira.demo",
    permissions: ["profile:read", "audit:read", "applications:read", "documents:read", "decisions:read", "access-history:read"],
    isReadOnly: true,
    primaryDashboardUrl: "/auditor/dashboard",
    aiGuidance: "Tracing complete application provenance, verifying SHA-256 Merkle proofs, auditing officer override rates, and verifying non-repudiation seals.",
    navItems: [
      { id: "overview", label: "Dashboard", to: "/auditor/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "audit", label: "Audit Log", to: "/auditor/audit", icon: ScrollText, section: "WORKSPACE" },
      { id: "decisions", label: "Decision Records", to: "/auditor/decisions", icon: Scale, section: "AUDIT" },
      { id: "applications", label: "Applications", to: "/auditor/applications", icon: ClipboardList, section: "WORKSPACE" },
      { id: "access", label: "Documents & Access History", to: "/auditor/evidence", icon: FileCheck2, section: "AUDIT" },
      { id: "profile", label: "Profile", to: "/auditor/settings", icon: User, section: "ACCOUNT" },
    ],
  },

  admin: {
    id: "admin",
    label: "Administrator",
    workspaceTitle: "Department Administration",
    subtitle: "State System Topology & Policy Orchestration",
    defaultIdentity: {
      name: "Arjun Mehta",
      designation: "Director General & Principal Administrator",
      organization: "Department of Social Welfare & Public Governance",
      idBadge: "ADM-STATE-01",
    },
    demoEmail: "demo.admin@mira.demo",
    permissions: ["*"],
    primaryDashboardUrl: "/department/dashboard",
    aiGuidance: "Orchestrating system-wide policies, reviewing API integrations, managing user roles, configuring scheme workflows, and inspecting system telemetry.",
    navItems: [
      { id: "dashboard", label: "Dashboard", to: "/department/dashboard", icon: Home, section: "WORKSPACE" },
      { id: "departments", label: "Departments", to: "/department/departments", icon: Building2, section: "WORKSPACE" },
      { id: "schemes", label: "Schemes", to: "/department/schemes", icon: Search, section: "WORKSPACE" },
      { id: "rules", label: "Eligibility Rules", to: "/department/rules", icon: ListTree, section: "SERVICES" },
      { id: "staff", label: "Staff", to: "/department/departments", icon: Users2, section: "WORKSPACE" },
      { id: "applications", label: "Applications", to: "/department/applications", icon: ClipboardList, section: "OPERATIONS" },
      { id: "operations", label: "Operations", to: "/department/operations", icon: Activity, section: "OPERATIONS" },
      { id: "audit", label: "Audit Log", to: "/department/audit", icon: ScrollText, section: "OPERATIONS" },
      { id: "notifications", label: "Notifications", to: "/department/notifications", icon: Bell, section: "OPERATIONS" },
      { id: "settings", label: "Platform Settings", to: "/department/settings", icon: Settings, section: "ACCOUNT" },
      { id: "profile", label: "Profile", to: "/department/settings", icon: User, section: "ACCOUNT" },
      { id: "profile", label: "Profile", to: "/department/settings", icon: User, section: "ACCOUNT" },
    ],
  },
};

export function getRoleConfig(role?: Role | null): RoleConfig {
  if (!role || !ROLE_CONFIGS[role]) {
    return ROLE_CONFIGS.citizen;
  }
  return ROLE_CONFIGS[role];
}
