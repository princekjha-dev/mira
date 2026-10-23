import { At as Gift, Ct as House, Dn as Bell, F as ScrollText, Ft as Flag, I as Scale, J as OctagonAlert, Lt as FileText, N as Search, Rn as Activity, Tn as Building2, X as Navigation, _ as TriangleAlert, bn as ChartColumn, d as User, dn as CircleQuestionMark, dt as ListTree, in as CloudDownload, it as Mail, j as Settings, k as ShieldCheck, l as Users, pt as Link2, qt as FileCheckCorner, sn as ClipboardList, u as UsersRound, xn as Camera } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-config-C62DEPSC.js
var ROLE_CONFIGS = {
	citizen: {
		id: "citizen",
		label: "Citizen / Applicant",
		workspaceTitle: "Citizen Workspace",
		subtitle: "Public Records, Household & Benefits",
		defaultIdentity: {
			name: "Rajesh Sharma",
			designation: "Head of Household",
			organization: "Sharma Family (MIRA-FAM-10482)",
			idBadge: "C-1001"
		},
		demoEmail: "demo.citizen@mira.demo",
		primaryDashboardUrl: "/citizen/dashboard",
		aiGuidance: "Assisting citizen with household records, scheme eligibility criteria, application status tracking, and required documentation.",
		navItems: [
			{
				id: "dashboard",
				label: "Dashboard",
				to: "/citizen/dashboard",
				icon: House
			},
			{
				id: "applications",
				label: "My Applications",
				to: "/citizen/applications",
				icon: ClipboardList
			},
			{
				id: "family",
				label: "My Family (Family360)",
				to: "/citizen/family",
				icon: Users
			},
			{
				id: "documents",
				label: "Documents",
				to: "/citizen/documents",
				icon: FileText
			},
			{
				id: "schemes",
				label: "Schemes",
				to: "/schemes",
				icon: Search
			},
			{
				id: "benefits",
				label: "Benefits & Entitlements",
				to: "/citizen/benefits",
				icon: Gift
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/citizen/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "notifications",
				label: "Notifications",
				to: "/citizen/notifications",
				icon: Bell,
				badge: "unreadNotifications"
			},
			{
				id: "grievances",
				label: "Grievances & Appeals",
				to: "/citizen/grievances",
				icon: CircleQuestionMark
			},
			{
				id: "profile",
				label: "Profile",
				to: "/citizen/settings",
				icon: User
			}
		]
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
			idBadge: "VER-UP-4029"
		},
		demoEmail: "demo.verifier@mira.demo",
		primaryDashboardUrl: "/verifier/dashboard",
		aiGuidance: "Analyzing registry cross-matches (Bhulekh, UIDAI, NFSA), detecting anomalies, summarizing household evidence, and checking statutory tolerances.",
		navItems: [
			{
				id: "overview",
				label: "Workstation Overview",
				to: "/verifier/dashboard",
				icon: House
			},
			{
				id: "queue",
				label: "Verification Queue",
				to: "/verifier/queue",
				icon: ClipboardList,
				badge: "pendingVerification"
			},
			{
				id: "family360",
				label: "Family360",
				to: "/verifier/family360",
				icon: Users
			},
			{
				id: "documents",
				label: "Document Comparison",
				to: "/verifier/documents",
				icon: FileCheckCorner
			},
			{
				id: "mismatches",
				label: "Mismatch Resolution",
				to: "/verifier/mismatches",
				icon: TriangleAlert,
				badge: "mismatches"
			},
			{
				id: "evidence",
				label: "Evidence Vault",
				to: "/verifier/evidence",
				icon: Camera
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/verifier/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "escalations",
				label: "Escalations & Flags",
				to: "/verifier/escalations",
				icon: Flag
			},
			{
				id: "audit",
				label: "Audit Ledger",
				to: "/verifier/audit",
				icon: ScrollText
			},
			{
				id: "profile",
				label: "Profile",
				to: "/verifier/settings",
				icon: User
			}
		]
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
			idBadge: "FLD-CD-108"
		},
		demoEmail: "officer@mira.local",
		primaryDashboardUrl: "/officer/dashboard",
		aiGuidance: "Assisting field official with daily route scheduling, geotagged dwelling inspections, offline checklist sync, and biometric presence confirmation.",
		navItems: [
			{
				id: "dashboard",
				label: "Dashboard",
				to: "/officer/dashboard",
				icon: House
			},
			{
				id: "visits",
				label: "Field Inspections",
				to: "/officer/field-visits",
				icon: Navigation
			},
			{
				id: "applications",
				label: "Applications",
				to: "/officer/applications",
				icon: ClipboardList
			},
			{
				id: "queue",
				label: "Verification Queue",
				to: "/officer/verification",
				icon: ShieldCheck
			},
			{
				id: "family360",
				label: "Family360",
				to: "/officer/family360",
				icon: Users
			},
			{
				id: "schemes",
				label: "Schemes Catalog",
				to: "/schemes",
				icon: Search
			},
			{
				id: "evidence",
				label: "Evidence Vault",
				to: "/officer/evidence",
				icon: Camera
			},
			{
				id: "duplicates",
				label: "Duplicate Signals",
				to: "/officer/duplicates",
				icon: OctagonAlert
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/officer/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "audit",
				label: "Audit Logs",
				to: "/officer/audit",
				icon: ScrollText
			},
			{
				id: "profile",
				label: "Profile",
				to: "/officer/settings",
				icon: User
			}
		]
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
			idBadge: "SCH-DIR-881"
		},
		demoEmail: "demo.scheme@mira.demo",
		primaryDashboardUrl: "/officer/dashboard",
		aiGuidance: "Evaluating scheme-level eligibility matrices, cross-scheme duplication checks, budget allocation limits, and statutory sanction rules.",
		navItems: [
			{
				id: "dashboard",
				label: "Scheme Operations",
				to: "/officer/dashboard",
				icon: House
			},
			{
				id: "queue",
				label: "Eligibility Queue",
				to: "/officer/verification",
				icon: ShieldCheck
			},
			{
				id: "applications",
				label: "Applications",
				to: "/officer/applications",
				icon: ClipboardList
			},
			{
				id: "family360",
				label: "Family360",
				to: "/officer/family360",
				icon: Users
			},
			{
				id: "schemes",
				label: "Welfare Schemes",
				to: "/schemes",
				icon: Search
			},
			{
				id: "eligibility",
				label: "Scheme Rules",
				to: "/department/rules",
				icon: ListTree
			},
			{
				id: "duplicates",
				label: "Decisions & Overlaps",
				to: "/officer/duplicates",
				icon: OctagonAlert
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/officer/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "audit",
				label: "Audit Ledger",
				to: "/officer/audit",
				icon: ScrollText
			},
			{
				id: "profile",
				label: "Profile",
				to: "/officer/settings",
				icon: User
			}
		]
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
			idBadge: "SUP-DIV-004"
		},
		demoEmail: "demo.supervisor@mira.demo",
		primaryDashboardUrl: "/verifier/dashboard",
		aiGuidance: "Advising supervisor on team throughput, SLA breach risks, legal split adjudications, and secondary escalation reviews.",
		navItems: [
			{
				id: "dashboard",
				label: "Review Overview",
				to: "/verifier/dashboard",
				icon: House
			},
			{
				id: "escalations",
				label: "Escalations & Flags",
				to: "/verifier/escalations",
				icon: Flag
			},
			{
				id: "queue",
				label: "Complex Cases",
				to: "/verifier/queue",
				icon: ClipboardList
			},
			{
				id: "family360",
				label: "Family360",
				to: "/verifier/family360",
				icon: Users
			},
			{
				id: "operations",
				label: "Appeals & Operations",
				to: "/department/operations",
				icon: Activity
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/verifier/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "audit",
				label: "Audit Ledger",
				to: "/verifier/audit",
				icon: ScrollText
			},
			{
				id: "reports",
				label: "Reports",
				to: "/department/reports",
				icon: ChartColumn
			},
			{
				id: "profile",
				label: "Profile",
				to: "/verifier/settings",
				icon: User
			}
		]
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
			idBadge: "CAG-AUD-2026"
		},
		demoEmail: "demo.auditor@mira.demo",
		isReadOnly: true,
		primaryDashboardUrl: "/auditor/dashboard",
		aiGuidance: "Tracing complete application provenance, verifying SHA-256 Merkle proofs, auditing officer override rates, and verifying non-repudiation seals.",
		navItems: [
			{
				id: "overview",
				label: "Audit Overview",
				to: "/auditor/dashboard",
				icon: House
			},
			{
				id: "audit",
				label: "Audit Ledger",
				to: "/auditor/audit",
				icon: ScrollText
			},
			{
				id: "decisions",
				label: "Decision History",
				to: "/auditor/decisions",
				icon: Scale
			},
			{
				id: "evidence",
				label: "Evidence Access History",
				to: "/auditor/evidence",
				icon: FileCheckCorner
			},
			{
				id: "family360",
				label: "Family360 (Read-Only)",
				to: "/auditor/family360",
				icon: Users
			},
			{
				id: "rules",
				label: "Eligibility Rule Audit",
				to: "/auditor/rules",
				icon: ListTree
			},
			{
				id: "officers",
				label: "Officer Integrity",
				to: "/auditor/officers",
				icon: UsersRound
			},
			{
				id: "reports",
				label: "Compliance Reports",
				to: "/auditor/reports",
				icon: ChartColumn
			},
			{
				id: "export",
				label: "Cryptographic Export",
				to: "/auditor/export",
				icon: CloudDownload
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/auditor/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "profile",
				label: "Profile",
				to: "/auditor/settings",
				icon: User
			}
		]
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
			idBadge: "ADM-STATE-01"
		},
		demoEmail: "demo.admin@mira.demo",
		primaryDashboardUrl: "/department/dashboard",
		aiGuidance: "Orchestrating system-wide policies, reviewing API integrations, managing user roles, configuring scheme workflows, and inspecting system telemetry.",
		navItems: [
			{
				id: "dashboard",
				label: "Administration",
				to: "/department/dashboard",
				icon: House
			},
			{
				id: "workflow",
				label: "System Configuration",
				to: "/department/settings",
				icon: Settings
			},
			{
				id: "departments",
				label: "Departments",
				to: "/department/departments",
				icon: Building2
			},
			{
				id: "schemes",
				label: "Schemes",
				to: "/department/schemes",
				icon: Search
			},
			{
				id: "rules",
				label: "Eligibility Rules",
				to: "/department/rules",
				icon: ListTree
			},
			{
				id: "applications",
				label: "Applications",
				to: "/department/applications",
				icon: ClipboardList
			},
			{
				id: "family360",
				label: "Family360",
				to: "/verifier/family360",
				icon: Users
			},
			{
				id: "operations",
				label: "Operations & SLA",
				to: "/department/operations",
				icon: Activity
			},
			{
				id: "integrations",
				label: "Integrations & APIs",
				to: "/department/integrations",
				icon: Link2
			},
			{
				id: "inbox",
				label: "Communications",
				to: "/department/inbox",
				icon: Mail,
				badge: "unreadMessages"
			},
			{
				id: "reports",
				label: "Reports & Analytics",
				to: "/department/reports",
				icon: ChartColumn
			},
			{
				id: "audit",
				label: "Audit Ledger",
				to: "/department/audit",
				icon: ScrollText
			},
			{
				id: "profile",
				label: "Profile",
				to: "/officer/settings",
				icon: User
			}
		]
	}
};
function getRoleConfig(role) {
	if (!role || !ROLE_CONFIGS[role]) return ROLE_CONFIGS.citizen;
	return ROLE_CONFIGS[role];
}
//#endregion
export { getRoleConfig as t };
