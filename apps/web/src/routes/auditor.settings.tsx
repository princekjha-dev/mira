import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  DownloadCloud,
} from "lucide-react";
import { ProfilePage, ProfileSection, ProfileRow } from "@/components/mira/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auditor/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Standards — Forensic Auditor" },
      { name: "description", content: "Senior forensic auditor profile, CAG compliance benchmarks, and cryptographic verification parameters." },
    ],
  }),
  component: AuditorProfileRoute,
});

function AuditorProfileRoute() {
  const [strictProof, setStrictProof] = useState(true);
  const [anomalySentinel, setAnomalySentinel] = useState(true);

  return (
    <ProfilePage
      roleSpecificSection={
        <ProfileSection
          title="Forensic Audit Standards (ISO/IEC 27001)"
          description="CAG audit rigor parameters for continuous mathematical ledger verification"
        >
          <ProfileRow
            icon={Scale}
            title="Strict Merkle Hash Verification"
            description="Re-calculates SHA-256 tree roots on every application determination in memory"
            action={
              <Switch
                checked={strictProof}
                onCheckedChange={(val) => {
                  setStrictProof(val);
                  toast.success(
                    val
                      ? "Strict Merkle verification enabled"
                      : "Standard batch verification mode"
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={ShieldCheck}
            title="Automated Anomaly Sentinel"
            description="Immediately flags overrides where an officer sanctioned outside statutory tolerance"
            action={
              <Switch
                checked={anomalySentinel}
                onCheckedChange={(val) => {
                  setAnomalySentinel(val);
                  toast.success(
                    val
                      ? "Anomaly sentinel active"
                      : "Anomaly sentinel disabled"
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={FileCode}
            title="CAG Audit Cryptographic Bundle"
            description="Read-only compliance export for parliamentary oversight committees"
            value={
              <span className="font-mono text-[10px] text-slate-500">
                BUNDLE-CAG-2026-Q3
              </span>
            }
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success("Audit certificate downloaded", {
                    description: "SHA256: 8a4c10…e449 verifiable proof bundle",
                  })
                }
                className="h-7 text-xs ml-2"
              >
                <DownloadCloud className="mr-1 h-3 w-3" />
                Export
              </Button>
            }
            isLast
          />
        </ProfileSection>
      }
    />
  );
}
