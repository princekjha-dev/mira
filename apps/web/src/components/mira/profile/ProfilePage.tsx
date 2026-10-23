import { useState, type ReactNode } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  KeyRound,
  Laptop,
  Globe,
  Bell,
  Eye,
  LogOut,
  CheckCircle2,
  FileCheck2,
  Sliders,
  ExternalLink,
  Layers,
  Sparkles,
  History,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { getRoleConfig } from "@/lib/role-config";
import { LANGUAGES } from "@/lib/i18n";
import { CITIZEN } from "@/lib/data";
import { fetchMyAuditActivity, type ApiMyAuditEvent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProfileSection } from "./ProfileSection";
import { ProfileRow } from "./ProfileRow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProfilePageProps {
  roleSpecificSection?: ReactNode;
}

export function ProfilePage({ roleSpecificSection }: ProfilePageProps) {
  const { state, set, logout } = useApp();
  const nav = useNavigate();

  const role = state.session?.role || "citizen";
  const roleConfig = getRoleConfig(role);

  const name = state.session?.name || roleConfig.defaultIdentity.name;
  const email =
    state.session?.email ||
    (role === "citizen" ? CITIZEN.email : roleConfig.demoEmail);
  const phone =
    role === "citizen"
      ? CITIZEN.mobile
      : "+91 94150 82910";
  const department =
    state.session?.department || roleConfig.defaultIdentity.organization;
  const idBadge =
    state.session?.id || roleConfig.defaultIdentity.idBadge;

  // Active language label
  const curLang = LANGUAGES.find((l) => l.code === state.lang) ?? LANGUAGES[0];

  const getInitials = (n: string) => {
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (n[0] || "U").toUpperCase();
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    nav({ to: "/" });
  };

  // Fetch Personal Audit Activity from PostgreSQL
  const { data: myAuditEvents = [], isLoading: isLoadingAudit } = useQuery<ApiMyAuditEvent[]>({
    queryKey: ["my-audit-activity", state.session?.apiUserId],
    queryFn: () => fetchMyAuditActivity(state.session),
    enabled: !!state.session,
    staleTime: 1000 * 30,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Section 22: Refined Apple-inspired Profile Header */}
      <header className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Avatar with Status Pip */}
            <div className="relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xl font-bold shadow-xs shrink-0">
              {getInitials(name)}
              <span
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
                title="Active Account"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active account
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                {roleConfig.label}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground pt-0.5">
                <span>{department}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="font-mono text-[11px] text-gov font-medium">
                  {idBadge}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Security token refreshed & synchronized");
              }}
              className="text-xs h-8 gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verify Token</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Section 23: Identity & Account Information */}
      <ProfileSection title="Account Identity" description="Official credentials recorded in state directory">
        <ProfileRow
          icon={User}
          title="Full Name"
          description="Verified citizen or government official name"
          value={name}
        />
        <ProfileRow
          icon={ShieldCheck}
          title="Assigned Role"
          description="Statutory authorization level within Mira"
          value={<span className="capitalize">{roleConfig.label}</span>}
        />
        <ProfileRow
          icon={Building2}
          title="Jurisdiction / Office"
          description="Designated ministry, tehsil, or district unit"
          value={department}
        />
        <ProfileRow
          icon={Layers}
          title="Officer / Profile ID"
          description="Cryptographically anchored identity badge"
          value={<span className="font-mono">{idBadge}</span>}
          isLast
        />
      </ProfileSection>

      {/* Section 23: Contact Information */}
      <ProfileSection title="Contact Information" description="Channels for official dispatches and OTP verification">
        <ProfileRow
          icon={Mail}
          title="Official Email"
          description="Used for alerts, determinations, and communications"
          value={email}
        />
        <ProfileRow
          icon={Phone}
          title="Mobile Number"
          description="Linked with Aadhaar / State directory for SMS OTP"
          value={phone}
          isLast
        />
      </ProfileSection>

      {/* Section 23: Preferences & Accessibility */}
      <ProfileSection title="Preferences & Appearance" description="Language localization and workstation accessibility">
        {/* Language selector */}
        <ProfileRow
          icon={Globe}
          title="Interface Language"
          description="Currently rendered language across forms and records"
          value={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1">
                  <span>{curLang.label}</span>
                  <span className="text-slate-400">▾</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuLabel className="text-[10px] uppercase font-mono text-muted-foreground">
                  Select Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => {
                      set({ lang: l.code });
                      toast.success(`Language changed to ${l.label}`);
                    }}
                    className="flex justify-between text-xs cursor-pointer"
                  >
                    <span>{l.label}</span>
                    {state.lang === l.code && <span className="text-gov font-bold">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

        {/* Notifications toggle */}
        <ProfileRow
          icon={Bell}
          title="In-App & Email Notifications"
          description="Receive dispatch notifications and clarification alerts"
          action={
            <Switch
              checked={state.notifPrefs.app}
              onCheckedChange={(val) => {
                set((s) => ({ notifPrefs: { ...s.notifPrefs, app: val, email: val } }));
                toast.success("Notification preferences saved");
              }}
            />
          }
        />

        {/* High contrast accessibility */}
        <ProfileRow
          icon={Eye}
          title="High Contrast Accessibility"
          description="Enhances text contrast and visual element separation"
          action={
            <Switch
              checked={state.highContrast}
              onCheckedChange={(val) => {
                set({ highContrast: val });
                document.documentElement.classList.toggle("hc", val);
                toast.success(val ? "High contrast enabled" : "High contrast disabled");
              }}
            />
          }
        />

        {/* Reduced motion */}
        <ProfileRow
          icon={Sliders}
          title="Reduced Motion"
          description="Disables layout shifts and animated transitions"
          action={
            <Switch
              checked={state.reducedMotion}
              onCheckedChange={(val) => {
                set({ reducedMotion: val });
                document.documentElement.classList.toggle("reduce-motion", val);
                toast.success(val ? "Reduced motion enabled" : "Standard motion enabled");
              }}
            />
          }
          isLast
        />
      </ProfileSection>

      {/* Role-specific section (e.g. Workstation Parameters / Connected Records) */}
      {roleSpecificSection}

      {/* Section 23: Security & Active Sessions */}
      <ProfileSection title="Security & Authentication" description="Cryptographic tokens, sign-in sessions, and audit status">
        <ProfileRow
          icon={KeyRound}
          title="Sign-In Mechanism"
          description="Statutory non-repudiation and verification standard"
          value={
            role === "citizen"
              ? "Aadhaar e-KYC (Demo Mode)"
              : role === "auditor"
                ? "CAG Forensic Token · RSA-4096"
                : "Gov Cloud SSO · Multi-Factor"
          }
        />
        <ProfileRow
          icon={Laptop}
          title="Active Sessions"
          description="Current workstation connection from verified IP"
          value="1 Active Device (This Browser)"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Signed out of all other devices")}
              className="h-7 text-xs"
            >
              Sign out others
            </Button>
          }
          isLast
        />
      </ProfileSection>

      {/* Section: My Audit Activity */}
      <ProfileSection
        title="My Audit Activity"
        description="Immutable record of authentication, profile access, and transaction history"
      >
        <div className="p-4 sm:p-5">
          {isLoadingAudit ? (
            <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100" />
              <span>Loading personal audit trail...</span>
            </div>
          ) : myAuditEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              No recent audit events recorded for this session.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/50">
                {myAuditEvents.slice(0, 6).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <History className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                          {ev.event_type}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          Request: {ev.request_id ? `${ev.request_id.slice(0, 8)}...` : "System-anchored"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(ev.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privilege Escalation / Dedicated Ledger link for authorized roles */}
              {role !== "citizen" ? (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-gov/5 p-3 border border-gov/15 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gov" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      Authorized Operational Access: Full Audit Ledger Available
                    </span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1 font-semibold">
                    <Link
                      to={
                        role === "auditor"
                          ? "/auditor/audit"
                          : role === "verifier"
                            ? "/verifier/audit"
                            : "/officer/audit"
                      }
                    >
                      <span>Open Ledger</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground pt-1">
                  Showing authenticated personal operations. Institutional system audit records are restricted under Section 8 of the Welfare Information Act.
                </p>
              )}
            </div>
          )}
        </div>
      </ProfileSection>

      {/* Danger Zone */}
      <ProfileSection title="Account Session" description="Terminate your authenticated session">
        <ProfileRow
          icon={LogOut}
          title="Sign Out of Mira"
          description="Safely end your workstation session and purge memory tokens"
          action={
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              className="h-8 text-xs font-semibold gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          }
          destructive
          isLast
        />
      </ProfileSection>
    </div>
  );
}
