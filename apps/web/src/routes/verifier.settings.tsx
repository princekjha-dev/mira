import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Zap,
  HardDrive,
  Key,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { ProfilePage, ProfileSection, ProfileRow } from "@/components/mira/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Workstation — Verification Officer" },
      { name: "description", content: "Verification officer identity, workstation parameters, and cryptographic token status." },
    ],
  }),
  component: VerifierProfileRoute,
});

function VerifierProfileRoute() {
  const [autoAssign, setAutoAssign] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);

  return (
    <ProfilePage
      roleSpecificSection={
        <ProfileSection
          title="Verification Workstation & HSM Security"
          description="Operational queue parameters and cryptographic hardware signing tokens"
        >
          <ProfileRow
            icon={Zap}
            title="Auto-Triage Next Available Case"
            description="Automatically locks the next critical SLA application on determination completion"
            action={
              <Switch
                checked={autoAssign}
                onCheckedChange={(val) => {
                  setAutoAssign(val);
                  toast.success(
                    val
                      ? "Auto-triage enabled: next case will auto-lock"
                      : "Auto-triage disabled: manual queue selection active"
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={HardDrive}
            title="Encrypted Document Cache"
            description="Maintains encrypted local cache for instantaneous side-by-side verification rendering"
            action={
              <Switch
                checked={offlineSync}
                onCheckedChange={(val) => {
                  setOfflineSync(val);
                  toast.success(
                    val
                      ? "Workstation local cache enabled"
                      : "Workstation cache purged"
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={Key}
            title="Hardware Security Module (HSM) Token"
            description="FIPS 140-2 Level 3 cryptographic smartcard for immutable determination signing"
            value={
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                HSM Connected (UP-GOV-HSM-4029)
              </span>
            }
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("HSM Cryptographic Key Verified")}
                className="h-7 text-xs ml-2"
              >
                Test Key
              </Button>
            }
            isLast
          />
        </ProfileSection>
      }
    />
  );
}
