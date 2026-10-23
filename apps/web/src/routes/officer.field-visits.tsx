import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  Navigation,
  FileCheck,
  CheckSquare,
  Square,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import type { FieldVisit } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/field-visits")({
  head: () => ({
    meta: [
      { title: "Field Visits — Field Official Operations" },
      { name: "description", content: "Field inspections, on-site geotagged verification, and physical dwelling audits." },
    ],
  }),
  component: OfficerFieldVisitsPage,
});

function OfficerFieldVisitsPage() {
  const { state, updateFieldVisit, addAudit } = useApp();
  const [filter, setFilter] = useState<"all" | "today" | "pending" | "completed">("all");
  const [activeVisit, setActiveVisit] = useState<FieldVisit | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  const visits = state.fieldVisits || [];

  const filteredVisits = visits.filter((v) => {
    if (filter === "today") return v.scheduledDate === "2026-10-24";
    if (filter === "completed") return v.status === "Completed";
    if (filter === "pending") return v.status !== "Completed";
    return true;
  });

  const handleToggleChecklist = (visit: FieldVisit, itemIndex: number) => {
    const updatedChecklist = [...visit.checklist];
    updatedChecklist[itemIndex] = {
      ...updatedChecklist[itemIndex],
      checked: !updatedChecklist[itemIndex].checked,
    };
    updateFieldVisit(visit.id, { checklist: updatedChecklist });
    toast.success("Checklist updated");
  };

  const handleCompleteVisit = (visit: FieldVisit) => {
    updateFieldVisit(visit.id, {
      status: "Completed",
      officerNotes: inspectionNotes || visit.officerNotes || "Physical site inspected. Structure condition and family residence confirmed.",
      citizenConfirmation: {
        confirmed: true,
        signedBy: visit.citizenName,
        timestamp: new Date().toISOString(),
      },
    });
    addAudit({
      actor: `${state.session?.name} (${state.session?.id})`,
      action: "Field Inspection Completed",
      application: visit.applicationId,
      prev: visit.status,
      next: "Completed",
      reason: `Dwelling verified at ${visit.address}`,
    });
    toast.success(`Field visit ${visit.id} verified and recorded on immutable audit ledger.`);
    setActiveVisit(null);
  };

  const handleSimulatePhoto = (visit: FieldVisit) => {
    const newPhotos = [
      ...(visit.evidencePhotos || []),
      `Geotagged Roof & Foundation Photo (${new Date().toLocaleTimeString()})`,
    ];
    updateFieldVisit(visit.id, { evidencePhotos: newPhotos });
    toast.success("Geotagged camera evidence synced (Lat: 26.8467, Lon: 80.9462)");
    setIsPhotoDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Inspection Operations"
        desc="On-site physical inspection schedule, geotagged evidence capture, and dwelling status reports."
        crumbs={[{ label: "Officer", to: "/officer/dashboard" }, { label: "Field Visits" }]}
      />

      {/* Operational Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Today's Route</span>
              <Navigation className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">2 Visits</div>
            <p className="text-[11px] text-muted-foreground">Chandauli Rural Cluster</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Verification Rate</span>
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
            </div>
            <div className="mt-2 text-2xl font-bold">94.8%</div>
            <p className="text-[11px] text-teal-600">SLA compliance met</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">GPS Precision</span>
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold">± 1.8 m</div>
            <p className="text-[11px] text-muted-foreground">ISRO NavIC high-accuracy lock</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pending Action</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold">{visits.filter((v) => v.status !== "Completed").length}</div>
            <p className="text-[11px] text-amber-600">Requires physical sign-off</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-3">
        {(
          [
            { id: "all", label: "All Inspections" },
            { id: "today", label: "Today's Schedule" },
            { id: "pending", label: "Pending Sign-off" },
            { id: "completed", label: "Completed" },
          ] as const
        ).map((tab) => (
          <Button
            key={tab.id}
            variant={filter === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.id)}
            className="rounded-full text-xs"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Visits List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredVisits.map((v) => (
          <Card key={v.id} className="flex flex-col justify-between border-border/80 shadow-xs transition-all hover:border-primary/40">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant={v.status === "Completed" ? "secondary" : "outline"} className="mb-2 text-[11px]">
                    {v.id} · {v.status}
                  </Badge>
                  <CardTitle className="text-base font-semibold">{v.citizenName}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{v.address}</span>
                  </CardDescription>
                </div>
                <div className="text-right text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{v.scheduledDate} · {v.scheduledTime}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-5 pt-2">
              {/* Checklist */}
              <div className="rounded-lg border bg-muted/30 p-3 text-xs">
                <p className="mb-2 font-medium text-foreground">On-Site Verification Checklist:</p>
                <div className="space-y-1.5">
                  {v.checklist.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleChecklist(v, idx)}
                      className="flex w-full items-center gap-2 text-left hover:text-primary"
                    >
                      {item.checked ? (
                        <CheckSquare className="h-4 w-4 text-teal-600 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={item.checked ? "line-through text-muted-foreground" : "text-foreground"}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Officer Notes or Citizen Sign */}
              {v.officerNotes && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Inspection Finding: </span>
                  {v.officerNotes}
                </div>
              )}

              {/* Evidence Photos */}
              {v.evidencePhotos && v.evidencePhotos.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {v.evidencePhotos.map((photo, i) => (
                    <Badge key={i} variant="outline" className="bg-background text-[10px] text-muted-foreground">
                      <Camera className="mr-1 h-3 w-3 text-primary" />
                      {photo}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => {
                      setActiveVisit(v);
                      setIsPhotoDialogOpen(true);
                    }}
                  >
                    <Camera className="mr-1.5 h-3.5 w-3.5" />
                    Add Photo
                  </Button>
                  <Button
                    size="sm"
                    variant={v.status === "Completed" ? "outline" : "default"}
                    className="h-8 text-xs"
                    onClick={() => {
                      setActiveVisit(v);
                      setInspectionNotes(v.officerNotes || "");
                    }}
                  >
                    <FileCheck className="mr-1.5 h-3.5 w-3.5" />
                    {v.status === "Completed" ? "Review Inspection" : "Complete & Sign"}
                  </Button>
                </div>

                <Link
                  to="/officer/applications/$id"
                  params={{ id: v.applicationId }}
                  className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                >
                  Application <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion & Signoff Dialog */}
      {activeVisit && !isPhotoDialogOpen && (
        <Dialog open={!!activeVisit} onOpenChange={(open) => !open && setActiveVisit(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Field Inspection — {activeVisit.id}</DialogTitle>
              <DialogDescription>
                Record final dwelling determination for {activeVisit.citizenName} ({activeVisit.applicationId}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-medium text-foreground">Officer Field Observations</label>
                <Textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="e.g. Dwelling inspected. Unfinished kutcha wall verified. Family of 5 residing on premise."
                  rows={4}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="rounded-md border border-teal-500/30 bg-teal-500/10 p-3 text-teal-800 dark:text-teal-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="font-semibold">Citizen Digital Presence Acknowledged</span>
                </div>
                <p className="mt-1 text-[11px] opacity-90">
                  Head of household authenticated via Aadhaar FaceRD/OTP presence on mobile field device.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setActiveVisit(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleCompleteVisit(activeVisit)}>
                <ShieldCheck className="mr-1.5 h-4 w-4" />
                Submit Verification Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Photo Capture Simulator Dialog */}
      {activeVisit && isPhotoDialogOpen && (
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Geotagged Evidence Camera
              </DialogTitle>
              <DialogDescription className="text-xs">
                Capturing timestamped physical evidence with GPS coordinate stamping.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-4 text-center">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-xs font-medium">NavIC GPS: 26.8467° N, 80.9462° E</p>
                <p className="text-[10px] text-muted-foreground">Accuracy: ± 1.8m · Bearing: 184° S</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsPhotoDialogOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSimulatePhoto(activeVisit)}>
                Capture & Stash Evidence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
