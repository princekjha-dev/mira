import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  RefreshCw,
  Globe,
  Lock,
  Cpu,
  Layers,
  Save,
} from "lucide-react";
import { ProfileSection, ProfileRow } from "@/components/mira/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/department/settings")({
  head: () => ({
    meta: [
      { title: "System Configuration — Department Administration" },
      {
        name: "description",
        content:
          "Department-wide governance, SLA thresholds, cross-registry synchronization, and cryptographic ledger parameters.",
      },
    ],
  }),
  component: DeptSettingsPage,
});

function DeptSettingsPage() {
  const [immutableAudits, setImmutableAudits] = useState(true);
  const [crossRegistrySync, setCrossRegistrySync] = useState(true);
  const [publicTransparency, setPublicTransparency] = useState(true);
  const [autoSlaEscalation, setAutoSlaEscalation] = useState(true);

  const handleSave = () => {
    toast.success("System configuration saved to state directory.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Quiet Header */}
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          System Configuration
        </h1>
        <p className="text-xs text-muted-foreground leading-normal max-w-3xl">
          Department-wide policy parameters, cryptographic ledger anchors, and
          statewide cross-registry synchronization.
        </p>
      </div>

      {/* Governance & Trust Section */}
      <ProfileSection
        title="Ledger Trust & Cryptographic Anchors"
        description="Statutory non-repudiation parameters governed under ISO/IEC 27001"
      >
        <ProfileRow
          icon={ShieldCheck}
          title="Immutable Audit Ledger Hashing"
          description="Generates verifiable SHA-256 Merkle root proofs on every citizen application determination"
          action={
            <Switch
              checked={immutableAudits}
              onCheckedChange={setImmutableAudits}
            />
          }
        />

        <ProfileRow
          icon={RefreshCw}
          title="Live Cross-Registry Reconciliation"
          description="Continuous synchronization with state Bhulekh land registry, NFSA ration rosters, and UIDAI e-KYC"
          action={
            <Switch
              checked={crossRegistrySync}
              onCheckedChange={setCrossRegistrySync}
            />
          }
        />

        <ProfileRow
          icon={Globe}
          title="Citizen Public Transparency Portal"
          description="Publishes sanitized aggregate scheme disbursements and sanction statistics to public dashboard"
          action={
            <Switch
              checked={publicTransparency}
              onCheckedChange={setPublicTransparency}
            />
          }
          isLast
        />
      </ProfileSection>

      {/* Operational SLA Section */}
      <ProfileSection
        title="Department Operations & SLA Thresholds"
        description="Automated bottleneck alerts and supervisory escalations"
      >
        <ProfileRow
          icon={Cpu}
          title="Automated 72-Hour SLA Escalation"
          description="Dispatches overdue verification queries to regional supervisor inbox automatically"
          action={
            <Switch
              checked={autoSlaEscalation}
              onCheckedChange={setAutoSlaEscalation}
            />
          }
        />

        <ProfileRow
          icon={Lock}
          title="Cryptographic Hardware Key Rotations"
          description="Automated 90-day HSM token lifecycle enforcement across all verification cells"
          value={
            <span className="font-mono text-xs text-emerald-600 font-semibold">
              Active · 90-Day Policy
            </span>
          }
          isLast
        />
      </ProfileSection>

      <div className="flex justify-end pt-2">
        <Button
          size="sm"
          onClick={handleSave}
          className="text-xs bg-gov hover:bg-gov/90 text-white font-medium gap-1.5 shadow-2xs"
        >
          <Save className="h-3.5 w-3.5" />
          Save System Configuration
        </Button>
      </div>
    </div>
  );
}
