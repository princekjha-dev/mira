import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  HeartCrack,
  Home,
  ShieldAlert,
  ShieldCheck,
  Split,
  User,
  UserPlus,
  UserX,
  Users,
  Wrench,
  AlertCircle,
  FileText,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import {
  fetchMyFamily,
  addFamilyMember,
  reportLifeEvent,
  raiseFamilyDispute,
  type ApiFamilyResponse,
  type ApiFamilyMember,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/family")({
  head: () => ({
    meta: [
      { title: "My Family Record — Mira Unified Welfare Platform" },
      {
        name: "description",
        content:
          "Persistent household graph, data-driven family tree, chronological lifecycle timeline, and relationship evidence.",
      },
      { property: "og:title", content: "My Family Record — Mira" },
    ],
  }),
  component: FamilyPage,
});

export function FamilyPage() {
  const { state } = useApp();
  const queryClient = useQueryClient();

  // Active Dialog States
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isReportEventOpen, setIsReportEventOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [selectedMemberHistory, setSelectedMemberHistory] =
    useState<ApiFamilyMember | null>(null);

  // Add Member Form
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newRelationship, setNewRelationship] = useState("CHILD");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState("Female");

  // Report Event Form
  const [eventType, setEventType] = useState("BIRTH");
  const [eventDate, setEventDate] = useState("");
  const [eventPerson, setEventPerson] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventCertNo, setEventCertNo] = useState("");

  // Dispute Form
  const [disputeCategory, setDisputeCategory] = useState("Relationship Correction");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [disputeDocRef, setDisputeDocRef] = useState("");

  // Fetch Live Family Graph from PostgreSQL
  const {
    data: familyData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ApiFamilyResponse>({
    queryKey: ["my-family", state.session?.apiUserId],
    queryFn: () => fetchMyFamily(state.session),
    enabled: !!state.session,
    staleTime: 1000 * 30,
  });

  // Add Member Mutation
  const addMemberMutation = useMutation({
    mutationFn: (payload: {
      first_name: string;
      last_name: string;
      relationship: string;
      date_of_birth: string;
      gender: string;
    }) => addFamilyMember(state.session, payload),
    onSuccess: (newMember) => {
      queryClient.invalidateQueries({ queryKey: ["my-family"] });
      toast.success(`${newMember.name} added to family record`, {
        description: "Relationship recorded in household registry.",
      });
      setIsAddMemberOpen(false);
      setNewFirstName("");
      setNewLastName("");
      setNewDob("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add family member.");
    },
  });

  // Report Event Mutation
  const reportEventMutation = useMutation({
    mutationFn: (payload: {
      event_type: string;
      effective_date: string;
      person_name: string;
      details: string;
      certificate_no: string;
    }) => reportLifeEvent(state.session, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-family"] });
      toast.success("Life event logged to timeline", {
        description: "Officer verification signal generated.",
      });
      setIsReportEventOpen(false);
      setEventDetails("");
      setEventCertNo("");
      setEventPerson("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to report life event.");
    },
  });

  // Raise Dispute Mutation
  const disputeMutation = useMutation({
    mutationFn: (payload: {
      category: string;
      description: string;
      document_reference?: string | null;
    }) => raiseFamilyDispute(state.session, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-family"] });
      toast.success(`Dispute ${data.id} submitted`, {
        description: "Officer assigned for correction review.",
      });
      setIsDisputeOpen(false);
      setDisputeDesc("");
      setDisputeDocRef("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit dispute.");
    },
  });

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim() || !newDob) {
      toast.error("Please fill in legal first name, last name, and date of birth.");
      return;
    }
    addMemberMutation.mutate({
      first_name: newFirstName.trim(),
      last_name: newLastName.trim(),
      relationship: newRelationship,
      date_of_birth: newDob,
      gender: newGender,
    });
  };

  const handleReportEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate || !eventDetails.trim()) {
      toast.error("Please enter the effective date and details.");
      return;
    }
    reportEventMutation.mutate({
      event_type: eventType,
      effective_date: eventDate,
      person_name: eventPerson.trim(),
      details: eventDetails.trim(),
      certificate_no: eventCertNo.trim(),
    });
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeDesc.trim()) {
      toast.error("Please describe the dispute or correction requested.");
      return;
    }
    disputeMutation.mutate({
      category: disputeCategory,
      description: disputeDesc.trim(),
      document_reference: disputeDocRef.trim() || null,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Family Record"
          desc="Loading verified household records from government database…"
        />
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-white">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-gov" />
            <p className="text-sm font-medium text-slate-600">
              Fetching household graph and relationships…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !familyData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Family Record"
          desc="Access your verified household graph and member relationships."
        />
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 text-base font-semibold text-destructive">
            Unable to load family records
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {error instanceof Error ? error.message : "Connection failed."}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const members = familyData.members || [];
  const relationships = familyData.relationships || [];
  const timeline = familyData.timeline || [];

  // Group members for data-driven tree
  const headsAndSpouses = members.filter(
    (m) => m.relationship === "HEAD" || m.relationship === "SPOUSE",
  );
  const children = members.filter((m) => m.relationship === "CHILD");
  const dependentsAndOthers = members.filter(
    (m) => m.relationship !== "HEAD" && m.relationship !== "SPOUSE" && m.relationship !== "CHILD",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="My Family Record"
          desc="Authoritative household roster, data-driven family tree, and chronological timeline. All changes undergo human officer verification."
        />
        <div className="flex items-center gap-2">
          {familyData.is_demo_data && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-300">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
              {familyData.disclaimer || ""}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 1. Family Overview Panel */}
      <Panel title="Household Overview">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <span className="text-xs uppercase font-mono text-muted-foreground tracking-wider">
              HOUSEHOLD PUBLIC ID
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-xl font-bold font-mono text-navy">
                {familyData.household_public_id}
              </h2>
              <span className="rounded bg-teal/15 text-teal text-xs font-semibold px-2 py-0.5">
                {familyData.verification_status}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {familyData.household_name}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-mono text-muted-foreground tracking-wider">
              HOUSEHOLD STATUS
            </span>
            <div className="mt-0.5">
              <Pill t="ok">{familyData.status}</Pill>
            </div>
          </div>
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">BPL Category</dt>
            <dd className="font-semibold text-slate-800 mt-0.5">{familyData.bpl_status}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">Income Tier</dt>
            <dd className="font-semibold text-slate-800 mt-0.5">{familyData.income_category}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground">Verified Property</dt>
            <dd className="text-slate-800 mt-0.5 text-xs leading-relaxed">
              {familyData.property_summary}
            </dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-xs font-medium text-muted-foreground">Current Residence Address</dt>
            <dd className="flex items-start gap-1.5 text-slate-800 mt-0.5 text-xs">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span>{familyData.address}</span>
            </dd>
          </div>
        </dl>
      </Panel>

      {/* Action Bar for Life Events & Modifications */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-50 p-4">
        <div>
          <h3 className="text-sm font-semibold text-navy">Family Actions & Life Events</h3>
          <p className="text-xs text-muted-foreground">
            Report births, marriages, or address changes. Consequential updates create officer review signals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddMemberOpen(true)}
            className="h-8 gap-1.5 text-xs bg-gov hover:bg-gov/90 text-white"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Family Member
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsReportEventOpen(true)}
            className="h-8 gap-1.5 text-xs"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-600" />
            Report Life Event
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDisputeOpen(true)}
            className="h-8 gap-1.5 text-xs text-amber-900 border-amber-300 hover:bg-amber-50"
          >
            <Wrench className="h-3.5 w-3.5 text-amber-700" />
            Raise Correction / Dispute
          </Button>
        </div>
      </div>

      {/* Main Tabs: Family Tree, Member Directory, Timeline */}
      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="tree">Family Tree</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({timeline.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: DATA-DRIVEN FAMILY TREE */}
        <TabsContent value="tree" className="space-y-6 pt-4">
          <Panel title="Data-Driven Family Tree & Relationships">
            <p className="text-xs text-muted-foreground mb-6">
              Relationships are computed dynamically from verifiable civil registry entries and verified relationships in the database.
            </p>

            <div className="space-y-8">
              {/* Tier 1: Elders / Parents / Dependents */}
              {dependentsAndOthers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-500">
                      PARENTS & DEPENDENTS
                    </span>
                    <div className="flex-1 border-t border-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dependentsAndOthers.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-navy">{m.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {m.public_id} · DOB {m.dob}
                            </p>
                          </div>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            {m.relationship}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="text-teal font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Identity {m.identity}
                          </span>
                          <span className="text-slate-500">{m.gender}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier 2: Household Heads & Spouses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-gov">
                    HOUSEHOLD HEAD & SPOUSE
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {headsAndSpouses.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg border-2 border-gov/30 bg-gov/5 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-bold text-navy">{m.name}</p>
                            {m.relationship === "HEAD" && (
                              <span className="rounded bg-gov text-white text-[10px] font-bold px-1.5 py-0.5">
                                HEAD
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-mono mt-0.5">
                            {m.public_id} · Born {m.dob}
                          </p>
                          {m.income && (
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              Declared Income: {m.income}
                            </p>
                          )}
                        </div>
                        <span className="rounded bg-white/80 px-2 py-0.5 text-xs font-semibold text-gov border border-gov/20">
                          {m.relationship}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gov/10">
                        <span className="text-teal font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> ID Verified
                        </span>
                        <span className="text-slate-600">{m.gender}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier 3: Children */}
              {children.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase font-mono tracking-wider font-semibold text-teal">
                      CHILDREN ({children.length})
                    </span>
                    <div className="flex-1 border-t border-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {children.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-teal/20 bg-teal/5 p-3.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-navy">{m.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {m.public_id} · DOB {m.dob}
                            </p>
                          </div>
                          <span className="rounded bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal">
                            Child
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-teal/10">
                          <span className="text-teal font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Identity {m.identity}
                          </span>
                          <span className="text-slate-500">{m.gender}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Relationships Table */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold uppercase font-mono text-slate-500 tracking-wider mb-2">
                  VERIFIED RELATIONSHIPS GRAPH
                </h4>
                <div className="overflow-x-auto rounded-lg border bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b">
                      <tr>
                        <th className="p-3">Person A</th>
                        <th className="p-3">Relationship</th>
                        <th className="p-3">Person B</th>
                        <th className="p-3">Valid From</th>
                        <th className="p-3">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-700">
                      {relationships.map((rel) => (
                        <tr key={rel.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-navy">{rel.person_a_name}</td>
                          <td className="p-3">
                            <span className="rounded bg-slate-100 font-mono px-2 py-0.5 text-[11px] text-slate-800">
                              {rel.relationship_type}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-navy">{rel.person_b_name}</td>
                          <td className="p-3 text-slate-500 font-mono">{rel.valid_from || "—"}</td>
                          <td className="p-3">
                            <span className="rounded bg-teal/15 text-teal px-1.5 py-0.5 text-[10px] font-semibold">
                              {rel.verification_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Panel>
        </TabsContent>

        {/* TAB 2: MEMBERS DIRECTORY */}
        <TabsContent value="members" className="pt-4">
          <ul className="divide-y rounded-lg border bg-card">
            {members.map((m) => (
              <li
                key={m.id}
                className="grid gap-3 p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy text-sm">{m.name}</p>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700">
                      {m.public_id}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.relationship} · Born {m.dob} · Gender: {m.gender}
                  </p>
                  {m.income && (
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Income: {m.income}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Pill t={m.identity === "Verified" ? "ok" : "warn"}>
                    ID: {m.identity}
                  </Pill>
                  <Pill t={m.membership === "Active" ? "info" : "neutral"}>
                    {m.membership}
                  </Pill>
                </div>
                <div className="text-xs text-slate-600">
                  {m.benefits?.length ? (
                    m.benefits.map((b) => (
                      <span key={b} className="block text-teal font-medium">
                        ✓ {b}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No active sanctions</span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => setSelectedMemberHistory(m)}
                >
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  Details
                </Button>
              </li>
            ))}
          </ul>
        </TabsContent>

        {/* TAB 3: CHRONOLOGICAL TIMELINE */}
        <TabsContent value="timeline" className="pt-4">
          <Panel title="Family Lifecycle History (Chronological)">
            <p className="text-xs text-muted-foreground mb-4">
              Events are immutable records from civil registries and attested documents. Historical events are never deleted.
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:top-2 before:left-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gov shadow-sm" />
                  <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gov">
                          {item.date}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-800">
                          {item.event_type}
                        </span>
                        <h4 className="text-sm font-semibold text-navy">{item.title}</h4>
                      </div>
                      <span className="rounded bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal">
                        {item.verification_status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-[11px] text-muted-foreground">
                      <span>Source: {item.source}</span>
                      <span>Verified by: {item.verified_by}</span>
                      {item.evidence && (
                        <span className="font-mono">Ref: {item.evidence}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* DIALOG: ADD FAMILY MEMBER */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Record a new member in household {familyData.household_public_id}. All added members persist in the relational database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMemberSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="mem-first-name">First Name</Label>
                <Input
                  id="mem-first-name"
                  placeholder="e.g. Rohan"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mem-last-name">Last Name</Label>
                <Input
                  id="mem-last-name"
                  placeholder="e.g. Sharma"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mem-relationship">Relationship to Head</Label>
              <Select value={newRelationship} onValueChange={setNewRelationship}>
                <SelectTrigger id="mem-relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHILD">Child (Son / Daughter)</SelectItem>
                  <SelectItem value="SPOUSE">Spouse</SelectItem>
                  <SelectItem value="PARENT">Parent (Father / Mother)</SelectItem>
                  <SelectItem value="DEPENDENT">Dependent / Relative</SelectItem>
                  <SelectItem value="GUARDIAN">Legal Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="mem-dob">Date of Birth</Label>
                <Input
                  id="mem-dob"
                  type="date"
                  value={newDob}
                  onChange={(e) => setNewDob(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mem-gender">Gender</Label>
                <Select value={newGender} onValueChange={setNewGender}>
                  <SelectTrigger id="mem-gender">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gov hover:bg-gov/90 text-white"
                disabled={addMemberMutation.isPending}
              >
                {addMemberMutation.isPending ? "Adding…" : "Save to Household"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: REPORT LIFE EVENT */}
      <Dialog open={isReportEventOpen} onOpenChange={setIsReportEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Life Event</DialogTitle>
            <DialogDescription>
              Log a birth, marriage, divorce, or address change to the chronological family timeline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportEventSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ev-type">Life Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="ev-type">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BIRTH">Birth of Child</SelectItem>
                  <SelectItem value="MARRIAGE">Marriage</SelectItem>
                  <SelectItem value="DIVORCE">Divorce / Separation</SelectItem>
                  <SelectItem value="DEATH">Death of Family Member</SelectItem>
                  <SelectItem value="ADDRESS_CHANGE">Change of Residence</SelectItem>
                  <SelectItem value="ADOPTION">Adoption / Guardianship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ev-date">Effective Date</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ev-person">Subject Person (Optional)</Label>
                <Input
                  id="ev-person"
                  placeholder="e.g. Rohan Sharma"
                  value={eventPerson}
                  onChange={(e) => setEventPerson(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ev-cert">Certificate / Registration No.</Label>
              <Input
                id="ev-cert"
                placeholder="e.g. BR-2026-9041"
                value={eventCertNo}
                onChange={(e) => setEventCertNo(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ev-details">Event Details</Label>
              <Textarea
                id="ev-details"
                placeholder="Provide details of civil registry or municipal registration…"
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReportEventOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gov hover:bg-gov/90 text-white"
                disabled={reportEventMutation.isPending}
              >
                {reportEventMutation.isPending ? "Submitting…" : "Record Life Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: RAISE DISPUTE / CORRECTION */}
      <Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Record Correction or Dispute</DialogTitle>
            <DialogDescription>
              Submit an official correction for misspelled names, erroneous relationships, or address conflicts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDisputeSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="disp-category">Category</Label>
              <Select value={disputeCategory} onValueChange={setDisputeCategory}>
                <SelectTrigger id="disp-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relationship Correction">Relationship Correction</SelectItem>
                  <SelectItem value="Address Correction">Address Discrepancy</SelectItem>
                  <SelectItem value="Identity Mismatch">Name / DOB Spelling Error</SelectItem>
                  <SelectItem value="Duplicate Clarification">Duplicate Claim Clarification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="disp-doc">Supporting Document Ref (Optional)</Label>
              <Input
                id="disp-doc"
                placeholder="e.g. DOC-ELEC-2026 or Certificate No."
                value={disputeDocRef}
                onChange={(e) => setDisputeDocRef(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="disp-desc">Explanation</Label>
              <Textarea
                id="disp-desc"
                placeholder="Detail the correct information and evidence provided…"
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDisputeOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-white"
                disabled={disputeMutation.isPending}
              >
                {disputeMutation.isPending ? "Submitting…" : "Submit Dispute"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: MEMBER DETAILS */}
      <Dialog
        open={!!selectedMemberHistory}
        onOpenChange={(open) => !open && setSelectedMemberHistory(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMemberHistory?.name}</DialogTitle>
            <DialogDescription>
              Member Public ID: {selectedMemberHistory?.public_id}
            </DialogDescription>
          </DialogHeader>
          {selectedMemberHistory && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border">
                <div>
                  <span className="text-muted-foreground">Relationship:</span>
                  <p className="font-semibold text-navy">{selectedMemberHistory.relationship}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-semibold text-navy">{selectedMemberHistory.dob}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-semibold text-navy">{selectedMemberHistory.gender}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Identity Status:</span>
                  <p className="font-semibold text-teal">{selectedMemberHistory.identity}</p>
                </div>
              </div>
              <p className="text-slate-600">
                All civil registry connections for this individual are verified under Household{" "}
                <span className="font-mono">{familyData.household_public_id}</span>.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedMemberHistory(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
