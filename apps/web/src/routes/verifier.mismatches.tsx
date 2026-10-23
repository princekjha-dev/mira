import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Send,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/verifier/mismatches")({
  head: () => ({
    meta: [
      { title: "Mismatch Resolution — Verifier Workstation" },
      { name: "description", content: "Triage and resolve cross-registry data mismatches and citizen explanations." },
    ],
  }),
  component: VerifierMismatchesPage,
});

function VerifierMismatchesPage() {
  const { state, updateApp, addAudit } = useApp();
  const [selectedMismatchApp, setSelectedMismatchApp] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const mismatches = state.applications.filter((a) => !!a.mismatch);

  const handleResolve = (appId: string, outcome: "Accepted" | "Clarification") => {
    const app = state.applications.find((a) => a.id === appId);
    if (!app) return;

    if (outcome === "Accepted") {
      updateApp(
        appId,
        {
          mismatch: undefined,
          status: "Officer Review",
        },
        `Mismatch resolved by verifier: ${resolutionNote || "Explanation and supporting records validated against revenue register."}`,
        state.session?.name
      );
      addAudit({
        actor: `${state.session?.name} (${state.session?.id})`,
        action: "Mismatch Overridden / Accepted",
        application: appId,
        prev: "Verification Required",
        next: "Officer Review",
        reason: resolutionNote || "Discrepancy reconciled with auxiliary proof.",
      });
      toast.success(`Mismatch resolved for ${appId}. Forwarded to final review.`);
    } else {
      updateApp(
        appId,
        {
          status: "Additional Evidence Required",
        },
        `Clarification requested: ${resolutionNote || "Please submit updated certificate or employer statement."}`,
        state.session?.name
      );
      addAudit({
        actor: `${state.session?.name} (${state.session?.id})`,
        action: "Evidence Requested",
        application: appId,
        prev: app.status,
        next: "Additional Evidence Required",
        reason: resolutionNote || "Clarification requested from citizen.",
      });
      toast.success(`Evidence request sent to citizen for ${appId}.`);
    }

    setSelectedMismatchApp(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mismatch & Discrepancy Resolution"
        desc="Cross-registry discrepancies flagged by automated verification rules requiring human judgment."
        crumbs={[{ label: "Verifier", to: "/verifier/dashboard" }, { label: "Mismatches" }]}
      />

      <div className="space-y-4">
        {mismatches.map((a) => (
          <Card key={a.id} className="border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{a.id}</span>
                  <Badge variant="outline" className="border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                    {a.mismatch?.field} Mismatch
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Applicant: <span className="font-medium text-foreground">{a.applicant}</span> ({a.householdId})
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4 text-xs">
              {/* Values grid */}
              <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                <div>
                  <span className="text-[11px] text-muted-foreground">Citizen Declared Value:</span>
                  <p className="mt-1 font-semibold text-foreground">{a.mismatch?.declared}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">{a.mismatch?.source} Value:</span>
                  <p className="mt-1 font-semibold text-foreground">{a.mismatch?.document}</p>
                </div>
              </div>

              {/* Context Explanation */}
              <p className="text-muted-foreground leading-relaxed">
                The revenue department database reflects agricultural income combined with dairy earnings. The applicant's certificate dated August 2025 records base agricultural earnings only.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setSelectedMismatchApp(a.id)}
                  >
                    <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                    Request Citizen Clarification
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setSelectedMismatchApp(a.id);
                      setResolutionNote("Validated against Tehsildar endorsement.");
                    }}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
                    Accept Declared Value & Resolve
                  </Button>
                </div>

                <Link
                  to="/verifier/applications/$id"
                  params={{ id: a.id }}
                  className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                >
                  Full Application <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {mismatches.length === 0 && (
          <Card className="border-dashed p-8 text-center text-muted-foreground">
            <CheckCircle2 className="mx-auto h-8 w-8 text-teal-600" />
            <p className="mt-2 text-sm font-medium">No unresolved mismatches in your jurisdiction</p>
            <p className="text-xs">All records match authoritative databases within allowable tolerances.</p>
          </Card>
        )}
      </div>

      {/* Resolution Dialog */}
      {selectedMismatchApp && (
        <Dialog open={!!selectedMismatchApp} onOpenChange={(open) => !open && setSelectedMismatchApp(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Discrepancy Resolution — {selectedMismatchApp}</DialogTitle>
              <DialogDescription className="text-xs">
                Submit finding or dispatch a statutory notice to the applicant.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-medium text-foreground">Official Rationale / Query Note</label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record justification for accepting the mismatch or specify the clarification required from the citizen."
                  rows={4}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve(selectedMismatchApp, "Clarification")}
              >
                Send Clarification Request
              </Button>
              <Button
                size="sm"
                onClick={() => handleResolve(selectedMismatchApp, "Accepted")}
              >
                Accept & Reconcile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
