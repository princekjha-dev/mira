import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileCheck,
  Building,
  Landmark,
  FileSpreadsheet,
  Banknote,
  FileText,
  Unlink,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { ProfilePage, ProfileSection, ProfileRow } from "@/components/mira/profile";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/citizen/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Account — Citizen" },
      { name: "description", content: "Citizen profile, authenticated identity, connected government records, and preferences." },
    ],
  }),
  component: CitizenProfileRoute,
});

function CitizenProfileRoute() {
  const [records, setRecords] = useState([
    { id: "civil", label: "Civil Registration (Birth & Family Tree)", linked: true, icon: FileCheck },
    { id: "revenue", label: "Revenue Registry (Income & Caste Certificates)", linked: true, icon: Building },
    { id: "land", label: "Tehsil Bhulekh (Land & Holding Records)", linked: true, icon: Landmark },
    { id: "bpl", label: "Rural Development (NFSA & BPL Roster)", linked: true, icon: FileSpreadsheet },
    { id: "dbt", label: "DBT Direct Benefit Bank Account (PFMS)", linked: false, icon: Banknote },
  ]);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  const handleToggle = (item: (typeof records)[0]) => {
    if (item.linked) {
      setRevokeTarget(item.label);
    } else {
      setRecords((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, linked: true } : r))
      );
      toast.success(`${item.label} successfully linked.`);
    }
  };

  const confirmUnlink = () => {
    if (!revokeTarget) return;
    setRecords((prev) =>
      prev.map((r) => (r.label === revokeTarget ? { ...r, linked: false } : r))
    );
    toast.info(`${revokeTarget} unlinked from real-time verification.`);
    setRevokeTarget(null);
  };

  return (
    <>
      <ProfilePage
        roleSpecificSection={
          <>
            {/* Connected Government Records Section */}
            <ProfileSection
              title="Connected Government Registries"
              description="Authorised state registries synchronized for instant benefit eligibility verification"
            >
              {records.map((r, i) => (
                <ProfileRow
                  key={r.id}
                  icon={r.icon}
                  title={r.label}
                  description={
                    r.linked
                      ? "Real-time state API synchronization active"
                      : "Manual document upload required for verification"
                  }
                  value={
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        r.linked
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          r.linked ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {r.linked ? "Synchronized" : "Disconnected"}
                    </span>
                  }
                  action={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(r)}
                      className="h-7 text-xs ml-2"
                    >
                      {r.linked ? "Disconnect" : "Connect"}
                    </Button>
                  }
                  isLast={i === records.length - 1}
                />
              ))}
            </ProfileSection>

            {/* Privacy & Consent Section */}
            <ProfileSection
              title="Privacy, Data Consent & Audit"
              description="Statutory non-repudiation and consent receipts recorded in immutable audit log"
            >
              <ProfileRow
                icon={ShieldCheck}
                title="Application Verification Consent"
                description="Permission for officers to query linked records for scheme sanctions"
                value={
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                    Active Consent
                  </span>
                }
              />
              <ProfileRow
                icon={FileText}
                title="Data Access Disclosure Report"
                description="Full forensic report of every officer and department that accessed your files"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success("Forensic disclosure report prepared", {
                        description: "Available in your Notifications within 24 hours.",
                      })
                    }
                    className="h-7 text-xs"
                  >
                    Request Report
                  </Button>
                }
                isLast
              />
            </ProfileSection>
          </>
        }
      />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(o) => !o && setRevokeTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-semibold">
              Disconnect {revokeTarget}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Applications requiring this registry will require physical document
              upload and slower manual tehsil verification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-8">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnlink}
              className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
