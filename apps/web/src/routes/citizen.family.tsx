import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Users,
  User,
  UserPlus,
  Calendar,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  MapPin,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Info,
  Gift,
  ClipboardList,
  Check,
  Eye,
  Building,
  FileCheck2,
  Layers,
  Sparkles,
  Award,
  Phone,
  Fingerprint,
  Home,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";
import { cn } from "@/lib/utils";
import {
  householdOverviewMock,
  attentionItemsMock,
  allMembersMock,
  applicationsMock,
  timelineEventsMock,
  benefitsMock,
  documentsMock,
  type FamilyMemberMock,
  type ApplicationMock,
  type DocumentMock,
  type TimelineEventMock,
} from "@/lib/family360MockData";

export const Route = createFileRoute("/citizen/family")({
  head: () => ({
    meta: [
      { title: "Family360 Household Record — MIRA Unified Platform" },
      {
        name: "description",
        content:
          "Official Household Family360 registry, relationship graph, tiered hierarchy tree, timeline events, verified documents, and entitlement services.",
      },
      { property: "og:title", content: "Family360 Household Record — MIRA" },
    ],
  }),
  component: FamilyPage,
});

export function FamilyPage() {
  // Navigation & Tabs State
  const [activeTab, setActiveTab] = useState<string>("family360");

  // Local Dataset State
  const [members, setMembers] = useState<FamilyMemberMock[]>(allMembersMock);
  const [timeline, setTimeline] = useState<TimelineEventMock[]>(timelineEventsMock);
  const [applications] = useState<ApplicationMock[]>(applicationsMock);
  const [benefits] = useState(benefitsMock);
  const [documents] = useState<DocumentMock[]>(documentsMock);

  // Selected Item Drawer & Modal States
  const [selectedMember, setSelectedMember] = useState<FamilyMemberMock | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationMock | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMock | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);

  // Action Modals State
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isReportEventOpen, setIsReportEventOpen] = useState(false);

  // Correction Form State
  const [correctionCategory, setCorrectionCategory] = useState("Identity information");
  const [correctionDescription, setCorrectionDescription] = useState("");
  const [correctionDocRef, setCorrectionDocRef] = useState("");

  // Add Member Form State
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newRelationship, setNewRelationship] = useState("Son");
  const [newDob, setNewDob] = useState("");
  const [newGender, setNewGender] = useState<"Male" | "Female" | "Other">("Male");

  // Report Event Form State
  const [newEventType, setNewEventType] = useState("Birth of child");
  const [newEventDate, setNewEventDate] = useState("24 Oct 2026");
  const [newEventPerson, setNewEventPerson] = useState("");
  const [newEventDetails, setNewEventDetails] = useState("");
  const [newEventCertNo, setNewEventCertNo] = useState("");

  // Graph Canvas Controls State
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphSearchQuery, setGraphSearchQuery] = useState("");
  const [graphMemberFilter, setGraphMemberFilter] = useState("ALL");
  const [graphVerificationFilter, setGraphVerificationFilter] = useState("ALL");

  // Members Table Search & Filters State
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberRelFilter, setMemberRelFilter] = useState("ALL");
  const [memberVerifFilter, setMemberVerifFilter] = useState("ALL");
  const [memberIssueFilter, setMemberIssueFilter] = useState("ALL");
  const [memberSortBy, setMemberSortBy] = useState<"name" | "age" | "verification">("name");

  // Tiered Tree Expand/Collapse State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    household: true,
    rajesh: true,
    amit: true,
    elders: false,
    extended: false,
  });

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  // Open Member Details Drawer
  const openMemberDetails = (member: FamilyMemberMock) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  // Handle Attention Item Action
  const handleAttentionAction = (actionType: "member_review" | "event_review" | "address_correction") => {
    if (actionType === "member_review") {
      setActiveTab("members");
      setMemberVerifFilter("PENDING_OR_REVIEW");
    } else if (actionType === "event_review") {
      setActiveTab("timeline");
    } else if (actionType === "address_correction") {
      setIsCaseModalOpen(true);
    }
  };

  // Submit Correction / Dispute
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionDescription.trim()) {
      toast.error("Please provide the correction or dispute details.");
      return;
    }
    toast.success("Correction Request Submitted", {
      description: `Case logged under ${correctionCategory}. Officer review token created.`,
    });
    setIsCorrectionModalOpen(false);
    setCorrectionDescription("");
    setCorrectionDocRef("");
  };

  // Submit Add Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim() || !newDob) {
      toast.error("Please fill in first name, last name, and date of birth.");
      return;
    }
    const fullName = `${newFirstName.trim()} ${newLastName.trim()}`;
    const newMemberId = `mem-${members.length + 1}`;
    const newMemberObj: FamilyMemberMock = {
      id: newMemberId,
      publicId: `MIRA-MEM-${String(members.length + 1).padStart(4, "0")}`,
      name: fullName,
      relationship: newRelationship,
      roleInHousehold: newRelationship,
      age: Math.max(0, new Date().getFullYear() - new Date(newDob).getFullYear()),
      dob: newDob,
      gender: newGender,
      verificationStatus: "Pending",
      documentsCount: 0,
      benefitsCount: 0,
      openIssuesCount: 0,
      declaredIncome: "Dependent",
      lastVerifiedDate: "Awaiting Verification",
      avatarInitials: `${newFirstName[0]?.toUpperCase() || "M"}${newLastName[0]?.toUpperCase() || "S"}`,
    };

    setMembers((prev) => [newMemberObj, ...prev]);
    toast.success(`${fullName} added to Household Record`, {
      description: "Member logged into local roster pending municipal verification.",
    });
    setIsAddMemberOpen(false);
    setNewFirstName("");
    setNewLastName("");
    setNewDob("");
  };

  // Submit Life Event
  const handleReportEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventDetails.trim()) {
      toast.error("Please provide details for the life event.");
      return;
    }
    const newEvent: TimelineEventMock = {
      id: `evt-${timeline.length + 1}`,
      date: newEventDate || "24 Oct 2026",
      title: newEventType,
      subtitle: newEventDetails.trim(),
      source: "Citizen",
      verifiedBy: "Civil Registrar Portal (Queued)",
      status: "Awaiting Review",
      category: "civil",
    };
    setTimeline((prev) => [newEvent, ...prev]);
    toast.success("Life event logged to timeline", {
      description: "Officer verification signal queued.",
    });
    setIsReportEventOpen(false);
    setNewEventDetails("");
    setNewEventCertNo("");
    setNewEventPerson("");
  };

  // Filtered Members for Members Table
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        if (memberSearchQuery) {
          const q = memberSearchQuery.toLowerCase();
          const matchName = m.name.toLowerCase().includes(q);
          const matchId = m.publicId.toLowerCase().includes(q);
          const matchRel = m.relationship.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchRel) return false;
        }
        if (memberRelFilter !== "ALL") {
          if (memberRelFilter === "HEAD_SPOUSE" && m.relationship !== "Household Head" && m.relationship !== "Spouse") return false;
          if (memberRelFilter === "CHILDREN" && m.relationship !== "Son" && m.relationship !== "Daughter" && m.relationship !== "Daughter-in-law") return false;
          if (memberRelFilter === "ELDERS" && m.relationship !== "Father" && m.relationship !== "Mother") return false;
          if (memberRelFilter === "EXTENDED" && ["Household Head", "Spouse", "Son", "Daughter", "Daughter-in-law", "Father", "Mother"].includes(m.relationship)) return false;
        }
        if (memberVerifFilter !== "ALL") {
          if (memberVerifFilter === "PENDING_OR_REVIEW" && m.verificationStatus === "Verified") return false;
          if (memberVerifFilter === "Verified" && m.verificationStatus !== "Verified") return false;
          if (memberVerifFilter === "Under Review" && m.verificationStatus !== "Under Review") return false;
          if (memberVerifFilter === "Pending" && m.verificationStatus !== "Pending") return false;
        }
        if (memberIssueFilter !== "ALL") {
          if (memberIssueFilter === "HAS_ISSUES" && m.openIssuesCount === 0) return false;
          if (memberIssueFilter === "CLEAN" && m.openIssuesCount > 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (memberSortBy === "name") return a.name.localeCompare(b.name);
        if (memberSortBy === "age") return b.age - a.age;
        if (memberSortBy === "verification") return a.verificationStatus.localeCompare(b.verificationStatus);
        return 0;
      });
  }, [members, memberSearchQuery, memberRelFilter, memberVerifFilter, memberIssueFilter, memberSortBy]);

  // Key Graph Members
  const rajesh = members.find((m) => m.id === "mem-01") || members[0];
  const sunita = members.find((m) => m.id === "mem-02");
  const amit = members.find((m) => m.id === "mem-03");
  const pooja = members.find((m) => m.id === "mem-04");
  const ananya = members.find((m) => m.id === "mem-05");
  const rohan = members.find((m) => m.id === "mem-06");

  // Render Member Card for Graph
  const renderMemberGraphCard = (member: FamilyMemberMock | undefined, customRole?: string) => {
    if (!member) return null;
    const isMatchesSearch = graphSearchQuery
      ? member.name.toLowerCase().includes(graphSearchQuery.toLowerCase()) ||
        member.relationship.toLowerCase().includes(graphSearchQuery.toLowerCase())
      : true;

    const isMatchesVerif =
      graphVerificationFilter === "ALL" || member.verificationStatus === graphVerificationFilter;

    const isDimmed = !isMatchesSearch || !isMatchesVerif;

    return (
      <div
        onClick={() => openMemberDetails(member)}
        className={cn(
          "group relative flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-150 cursor-pointer text-center w-48 hover:border-gov hover:shadow-md hover:-translate-y-0.5",
          member.verificationStatus === "Verified" && "border-slate-200 bg-white",
          member.verificationStatus === "Under Review" && "border-amber-300 bg-amber-50/30",
          member.verificationStatus === "Pending" && "border-amber-200 bg-amber-50/20",
          isDimmed && "opacity-40 grayscale"
        )}
      >
        {/* Status Pill Badge */}
        <div className="absolute -top-2.5 right-2">
          {member.verificationStatus === "Verified" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-300 shadow-2xs">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
              Verified
            </span>
          )}
          {member.verificationStatus === "Under Review" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900 border border-amber-300 shadow-2xs">
              <Clock className="h-2.5 w-2.5 text-amber-700" />
              Under Review
            </span>
          )}
          {member.verificationStatus === "Pending" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-300 shadow-2xs">
              <AlertTriangle className="h-2.5 w-2.5 text-amber-600" />
              Pending
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="relative mb-2 mt-1">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-slate-700 shadow-2xs ring-2",
              member.verificationStatus === "Verified"
                ? "bg-slate-100 text-slate-800 ring-emerald-400"
                : member.verificationStatus === "Under Review"
                  ? "bg-amber-100 text-amber-900 ring-amber-400"
                  : "bg-slate-100 text-slate-600 ring-slate-300"
            )}
          >
            {member.avatarInitials}
          </div>
          {member.relationship === "Household Head" && (
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gov text-[9px] font-bold text-white shadow-xs">
              ★
            </div>
          )}
        </div>

        {/* Member Details */}
        <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-gov">
          {member.name}
        </h4>
        <p className="text-[11px] font-medium text-gov mt-0.5">
          {customRole || member.relationship}
        </p>
        <p className="text-[10px] text-slate-500 font-mono mt-1">
          Age {member.age} • {member.gender}
        </p>

        {/* Footer Hint */}
        <div className="mt-2.5 pt-2 w-full border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-gov">
          <span className="font-mono text-[9px]">{member.publicId}</span>
          <span className="font-medium flex items-center gap-0.5 text-gov">
            Details <ChevronRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Breadcrumb and Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Household Record</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700 font-semibold">Sharma Family</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Family360 Household Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Civil relationship graph, multi-generational roster, and statutory benefit entitlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono font-medium text-slate-700 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            Registry Source: UP-CIVIL-2026
          </span>
        </div>
      </div>

      {/* 2. HOUSEHOLD OVERVIEW (Section 2) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Top Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-4 sm:px-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              HOUSEHOLD PUBLIC ID
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                {householdOverviewMock.householdPublicId}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-teal/15 text-teal text-xs font-bold px-2 py-0.5 border border-teal/30">
                <CheckCircle className="h-3 w-3" />
                {householdOverviewMock.familyName} · {householdOverviewMock.verificationStatus}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col sm:items-end justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              HOUSEHOLD STATUS
            </span>
            <div className="mt-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                {householdOverviewMock.householdStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Compact Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 border-b border-slate-100 bg-white text-left">
          <div className="p-4 sm:px-6">
            <p className="text-[11px] font-medium text-slate-500 uppercase font-mono">Household Head</p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {householdOverviewMock.stats.headOfHousehold}
            </p>
          </div>
          <div className="p-4 sm:px-6">
            <p className="text-[11px] font-medium text-slate-500 uppercase font-mono">Total Members</p>
            <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
              {householdOverviewMock.stats.totalMembers}
            </p>
          </div>
          <div className="p-4 sm:px-6">
            <p className="text-[11px] font-medium text-slate-500 uppercase font-mono">Verified Members</p>
            <p className="text-sm font-bold text-emerald-700 mt-1 font-mono flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {householdOverviewMock.stats.verifiedMembers}
            </p>
          </div>
          <div className="p-4 sm:px-6">
            <p className="text-[11px] font-medium text-slate-500 uppercase font-mono">Pending Review</p>
            <p className="text-sm font-bold text-amber-700 mt-1 font-mono flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {householdOverviewMock.stats.pendingReview}
            </p>
          </div>
          <div className="p-4 sm:px-6 col-span-2 sm:col-span-1">
            <p className="text-[11px] font-medium text-slate-500 uppercase font-mono">Open Issues</p>
            <p className="text-sm font-bold text-red-600 mt-1 font-mono flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              {householdOverviewMock.stats.openIssues}
            </p>
          </div>
        </div>

        {/* Secondary Household Record Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:px-6 text-xs bg-slate-50/40">
          <div>
            <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">
              BPL Category
            </span>
            <p className="font-semibold text-slate-800 mt-0.5">{householdOverviewMock.bplCategory}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">
              Income Tier
            </span>
            <p className="font-semibold text-slate-800 mt-0.5">{householdOverviewMock.incomeTier}</p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">
              Property Type
            </span>
            <p className="font-semibold text-slate-800 mt-0.5">
              {householdOverviewMock.propertyType}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              ✓ {householdOverviewMock.propertyVerificationSubtext}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 uppercase text-[10px] font-mono">
              Current Residence
            </span>
            <p className="text-slate-800 mt-0.5 flex items-start gap-1 leading-relaxed">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500 mt-0.5" />
              <span>{householdOverviewMock.currentResidence}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. ATTENTION REQUIRED SECTION (Section 3) */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
              !
            </span>
            <h3 className="text-sm font-bold text-slate-900">Attention Required</h3>
          </div>
          <span className="text-xs font-medium text-amber-900">
            There are 3 items that need your attention.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {attentionItemsMock.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-white/80 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "font-semibold text-[11px]",
                      item.severity === "amber" && "text-amber-800",
                      item.severity === "blue" && "text-gov font-medium",
                      item.severity === "red" && "text-red-600"
                    )}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAttentionAction(item.actionType)}
                className="h-7 text-xs font-semibold text-gov hover:text-gov hover:bg-gov/5 gap-1 shrink-0 px-2"
              >
                {item.actionText}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HOUSEHOLD ACTIONS (Section 4) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
            Household Operations & Civil Actions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit family modifications, new member inclusions, or official corrections.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Blue Button */}
          <Button
            size="sm"
            onClick={() => setIsAddMemberOpen(true)}
            className="h-8 gap-1.5 text-xs bg-gov hover:bg-gov/90 text-white font-medium shadow-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Family Member
          </Button>

          {/* Secondary Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsReportEventOpen(true)}
            className="h-8 gap-1.5 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            Report Life Event
          </Button>

          {/* High-Importance Outlined Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCorrectionModalOpen(true)}
            className="h-8 gap-1.5 text-xs border-amber-400 bg-amber-50/50 text-amber-900 hover:bg-amber-100 hover:border-amber-500 font-semibold"
          >
            <Wrench className="h-3.5 w-3.5 text-amber-700" />
            Raise Correction / Dispute
          </Button>
        </div>
      </div>

      {/* 5. FAMILY360 NAVIGATION TABS (Section 5) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-slate-200 overflow-x-auto">
          <TabsList className="h-10 bg-transparent p-0 gap-1 sm:gap-2 flex justify-start w-max min-w-full">
            <TabsTrigger
              value="family360"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Family360 Graph
            </TabsTrigger>
            <TabsTrigger
              value="tree"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Tiered Tree
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Members ({members.length})
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Timeline ({timeline.length})
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <Gift className="h-3.5 w-3.5 mr-1.5" />
              Benefits ({benefits.length})
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="h-10 rounded-none border-b-2 border-transparent px-3.5 py-2 text-xs font-semibold text-slate-600 data-[state=active]:border-gov data-[state=active]:text-gov data-[state=active]:bg-transparent shadow-none"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Documents ({documents.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: FAMILY360 GRAPH (Section 6, 7, 8)                                  */}
        {/* ========================================================================= */}
        <TabsContent value="family360" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Graph Controls Toolbar (Section 8) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 p-3 px-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search member */}
                <div className="relative w-44 sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search member..."
                    value={graphSearchQuery}
                    onChange={(e) => setGraphSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-white"
                  />
                  {graphSearchQuery && (
                    <button
                      onClick={() => setGraphSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Member filter */}
                <Select value={graphMemberFilter} onValueChange={setGraphMemberFilter}>
                  <SelectTrigger className="h-8 w-36 text-xs bg-white">
                    <SelectValue placeholder="Member filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Nodes</SelectItem>
                    <SelectItem value="DIRECT">Direct Lineage</SelectItem>
                    <SelectItem value="HEAD">Head & Spouse</SelectItem>
                  </SelectContent>
                </Select>

                {/* Verification filter */}
                <Select value={graphVerificationFilter} onValueChange={setGraphVerificationFilter}>
                  <SelectTrigger className="h-8 w-36 text-xs bg-white">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Zoom & Reset Controls */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setGraphZoom((z) => Math.min(1.4, z + 0.1))}
                  className="h-7 w-7 p-0 text-slate-600 hover:text-gov"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] font-mono font-medium text-slate-500 px-1">
                  {Math.round(graphZoom * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setGraphZoom((z) => Math.max(0.7, z - 0.1))}
                  className="h-7 w-7 p-0 text-slate-600 hover:text-gov"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <div className="h-4 w-px bg-slate-200 mx-0.5" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setGraphZoom(1)}
                  className="h-7 text-xs px-2 text-slate-600 hover:text-gov"
                  title="Fit & Reset Graph"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Official Relationship Canvas (Section 6 & 7) */}
            <div className="relative overflow-x-auto p-8 sm:p-12 bg-slate-50/50 min-h-[580px] flex flex-col items-center justify-center">
              {/* Background Graph Grid Dots */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #64748b 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div
                className="relative flex flex-col items-center transition-transform duration-200"
                style={{ transform: `scale(${graphZoom})`, transformOrigin: "top center" }}
              >
                {/* ------------------------------------------------------------- */}
                {/* LEVEL 1: Household Head (Rajesh Sharma)                       */}
                {/* ------------------------------------------------------------- */}
                <div className="flex flex-col items-center relative z-10">
                  <span className="mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-0.5 shadow-2xs">
                    Primary Household Head (Level 1)
                  </span>
                  {renderMemberGraphCard(rajesh, "Household Head")}
                </div>

                {/* Vertical Stem from Rajesh down */}
                <div className="w-0.5 h-10 bg-slate-300" />

                {/* Horizontal Crossbar across Sunita, Amit, Pooja */}
                <div className="relative w-[560px] sm:w-[680px]">
                  {/* The Horizontal Line */}
                  <div className="absolute top-0 left-[96px] right-[96px] h-0.5 bg-slate-300" />

                  {/* Dropdown Stems into the 3 cards */}
                  <div className="grid grid-cols-3 pt-6 gap-6 sm:gap-10">
                    {/* 1. Spouse (Sunita Sharma) */}
                    <div className="flex flex-col items-center relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300" />
                      <span className="mb-1 text-[9px] font-mono text-slate-400 uppercase font-semibold">
                        Spouse
                      </span>
                      {renderMemberGraphCard(sunita, "Spouse")}
                    </div>

                    {/* 2. Son (Amit Sharma) */}
                    <div className="flex flex-col items-center relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300" />
                      <span className="mb-1 text-[9px] font-mono text-slate-400 uppercase font-semibold">
                        Son
                      </span>
                      {renderMemberGraphCard(amit, "Son")}

                      {/* Vertical Stem from Amit down to Children */}
                      <div className="w-0.5 h-8 bg-slate-300 mt-2" />

                      {/* Crossbar for Amit's Children (Ananya & Rohan) */}
                      <div className="relative w-[380px]">
                        <div className="absolute top-0 left-[80px] right-[80px] h-0.5 bg-slate-300" />
                        <div className="grid grid-cols-2 pt-6 gap-6">
                          {/* Daughter (Ananya) */}
                          <div className="flex flex-col items-center relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300" />
                            <span className="mb-1 text-[9px] font-mono text-slate-400 uppercase font-semibold">
                              Daughter
                            </span>
                            {renderMemberGraphCard(ananya, "Daughter")}
                          </div>

                          {/* Son (Rohan) */}
                          <div className="flex flex-col items-center relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300" />
                            <span className="mb-1 text-[9px] font-mono text-slate-400 uppercase font-semibold">
                              Son
                            </span>
                            {renderMemberGraphCard(rohan, "Son")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Daughter-in-law (Pooja Sharma) */}
                    <div className="flex flex-col items-center relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-300" />
                      <span className="mb-1 text-[9px] font-mono text-slate-400 uppercase font-semibold">
                        Daughter-in-law
                      </span>
                      {renderMemberGraphCard(pooja, "Daughter-in-law")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Graph Footnote */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 bg-white p-3 px-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-slate-400" />
                Clicking any member card opens their verified civil records, benefits, and statutory documents.
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={() => setActiveTab("members")}
                className="h-auto p-0 text-xs font-semibold text-gov hover:underline justify-start sm:justify-end"
              >
                View all 20 household members in directory →
              </Button>
            </div>
          </div>

          {/* Related Applications Widget (Section 10) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Related Applications (3)
                </h3>
                <p className="text-xs text-slate-500">
                  Active scheme benefit sanctions linked to this household record.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("applications")}
                className="text-xs text-gov font-medium h-7"
              >
                View all →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 hover:bg-white hover:border-gov/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {app.id}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                          app.status === "Approved" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                          app.status === "Under Verification" && "bg-amber-50 text-amber-800 border-amber-300",
                          app.status === "In Progress" && "bg-blue-50 text-blue-800 border-blue-300"
                        )}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-2">{app.scheme}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Submitted: {app.submittedDate}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Applicant: {app.applicant}</span>
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsApplicationModalOpen(true);
                      }}
                      className="h-auto p-0 text-xs font-semibold text-gov hover:underline"
                    >
                      View →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: TIERED TREE (Section 13)                                           */}
        {/* ========================================================================= */}
        <TabsContent value="tree" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Structured Hierarchical Tree
                </h3>
                <p className="text-xs text-slate-500">
                  Formal hierarchical representation of household lineage, spouse linkages, and direct dependents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setExpandedNodes({
                      household: true,
                      rajesh: true,
                      amit: true,
                      elders: true,
                      extended: true,
                    })
                  }
                  className="h-7 text-xs"
                >
                  Expand All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setExpandedNodes({
                      household: true,
                      rajesh: false,
                      amit: false,
                      elders: false,
                      extended: false,
                    })
                  }
                  className="h-7 text-xs"
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Tree View Structure */}
            <div className="font-mono text-xs space-y-2 bg-slate-50/50 p-4 rounded-lg border border-slate-200">
              {/* Root: HOUSEHOLD */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleNode("household")}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                >
                  {expandedNodes.household ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <span className="font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                  HOUSEHOLD: MIRA-FAM-10482
                </span>
                <span className="text-[11px] text-slate-500 font-sans">Sharma Family (Active)</span>
              </div>

              {expandedNodes.household && (
                <div className="pl-6 border-l-2 border-slate-300 ml-2.5 space-y-3 pt-2">
                  {/* Rajesh Sharma Node */}
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleNode("rajesh")}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      >
                        {expandedNodes.rajesh ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <div
                        onClick={() => rajesh && openMemberDetails(rajesh)}
                        className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-2xs hover:border-gov cursor-pointer"
                      >
                        <span className="font-bold text-slate-900">{rajesh?.name}</span>
                        <span className="rounded bg-gov text-white text-[10px] font-semibold px-1.5 py-0.2">
                          Household Head
                        </span>
                        <span className="text-emerald-700 font-sans text-[11px] font-semibold">✓ Verified</span>
                      </div>
                    </div>

                    {expandedNodes.rajesh && (
                      <div className="pl-6 border-l-2 border-slate-300 ml-2.5 space-y-2.5 pt-2">
                        {/* Sunita Sharma (Spouse) */}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">├──</span>
                          <div
                            onClick={() => sunita && openMemberDetails(sunita)}
                            className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer"
                          >
                            <span className="font-semibold text-slate-800">{sunita?.name}</span>
                            <span className="text-slate-500 font-sans text-[11px]">Spouse</span>
                            <span className="text-emerald-700 text-[10px]">✓ Verified</span>
                          </div>
                        </div>

                        {/* Amit Sharma (Son) with Children */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">├──</span>
                            <button
                              onClick={() => toggleNode("amit")}
                              className="p-0.5 hover:bg-slate-200 rounded text-slate-600"
                            >
                              {expandedNodes.amit ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </button>
                            <div
                              onClick={() => amit && openMemberDetails(amit)}
                              className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer"
                            >
                              <span className="font-semibold text-slate-800">{amit?.name}</span>
                              <span className="text-slate-500 font-sans text-[11px]">Son</span>
                              <span className="text-emerald-700 text-[10px]">✓ Verified</span>
                            </div>
                          </div>

                          {expandedNodes.amit && (
                            <div className="pl-10 border-l-2 border-slate-300 ml-5 space-y-2 pt-2">
                              {/* Ananya Sharma (Daughter of Amit) */}
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">├──</span>
                                <div
                                  onClick={() => ananya && openMemberDetails(ananya)}
                                  className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer"
                                >
                                  <span className="font-semibold text-slate-800">{ananya?.name}</span>
                                  <span className="text-slate-500 font-sans text-[11px]">Daughter</span>
                                  <span className="text-emerald-700 text-[10px]">✓ Verified</span>
                                </div>
                              </div>

                              {/* Rohan Sharma (Son of Amit) */}
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">└──</span>
                                <div
                                  onClick={() => rohan && openMemberDetails(rohan)}
                                  className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer"
                                >
                                  <span className="font-semibold text-slate-800">{rohan?.name}</span>
                                  <span className="text-slate-500 font-sans text-[11px]">Son</span>
                                  <span className="text-amber-800 text-[10px] font-bold">! Pending</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pooja Sharma (Daughter-in-law) */}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">└──</span>
                          <div
                            onClick={() => pooja && openMemberDetails(pooja)}
                            className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer"
                          >
                            <span className="font-semibold text-slate-800">{pooja?.name}</span>
                            <span className="text-slate-500 font-sans text-[11px]">Daughter-in-law</span>
                            <span className="text-amber-800 text-[10px] font-bold">! Under Review</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Elders Branch */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleNode("elders")}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      >
                        {expandedNodes.elders ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        PARENTS & ELDERS (2)
                      </span>
                    </div>
                    {expandedNodes.elders && (
                      <div className="pl-6 border-l-2 border-slate-300 ml-2.5 space-y-1.5 pt-2">
                        {members
                          .filter((m) => m.relationship === "Father" || m.relationship === "Mother")
                          .map((m) => (
                            <div
                              key={m.id}
                              onClick={() => openMemberDetails(m)}
                              className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer w-max"
                            >
                              <span className="font-semibold text-slate-800">{m.name}</span>
                              <span className="text-slate-500 font-sans text-[11px]">{m.relationship}</span>
                              <span className="text-emerald-700 text-[10px]">✓ {m.verificationStatus}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Extended Family Branch */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleNode("extended")}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600"
                      >
                        {expandedNodes.extended ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        EXTENDED DEPENDENTS & CO-RESIDENTS (12)
                      </span>
                    </div>
                    {expandedNodes.extended && (
                      <div className="pl-6 border-l-2 border-slate-300 ml-2.5 space-y-1.5 pt-2">
                        {members
                          .filter(
                            (m) =>
                              !["Household Head", "Spouse", "Son", "Daughter", "Daughter-in-law", "Father", "Mother"].includes(
                                m.relationship
                              )
                          )
                          .map((m) => (
                            <div
                              key={m.id}
                              onClick={() => openMemberDetails(m)}
                              className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:border-gov cursor-pointer w-max"
                            >
                              <span className="font-semibold text-slate-800">{m.name}</span>
                              <span className="text-slate-500 font-sans text-[11px]">{m.relationship}</span>
                              <span className="text-emerald-700 text-[10px]">✓ {m.verificationStatus}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: MEMBERS TAB (Section 12)                                           */}
        {/* ========================================================================= */}
        <TabsContent value="members" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 p-3 px-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-44 sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-white"
                  />
                </div>

                {/* Relationship filter */}
                <Select value={memberRelFilter} onValueChange={setMemberRelFilter}>
                  <SelectTrigger className="h-8 w-36 text-xs bg-white">
                    <SelectValue placeholder="Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Relationships</SelectItem>
                    <SelectItem value="HEAD_SPOUSE">Head & Spouse</SelectItem>
                    <SelectItem value="CHILDREN">Children</SelectItem>
                    <SelectItem value="ELDERS">Elders</SelectItem>
                    <SelectItem value="EXTENDED">Extended Family</SelectItem>
                  </SelectContent>
                </Select>

                {/* Verification filter */}
                <Select value={memberVerifFilter} onValueChange={setMemberVerifFilter}>
                  <SelectTrigger className="h-8 w-36 text-xs bg-white">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Verification</SelectItem>
                    <SelectItem value="Verified">Verified Only</SelectItem>
                    <SelectItem value="PENDING_OR_REVIEW">Pending / Review</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                {/* Issue filter */}
                <Select value={memberIssueFilter} onValueChange={setMemberIssueFilter}>
                  <SelectTrigger className="h-8 w-32 text-xs bg-white">
                    <SelectValue placeholder="Issues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Records</SelectItem>
                    <SelectItem value="HAS_ISSUES">With Issues</SelectItem>
                    <SelectItem value="CLEAN">No Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Sort:</span>
                <button
                  onClick={() => setMemberSortBy("name")}
                  className={cn("px-2 py-1 rounded", memberSortBy === "name" ? "bg-slate-200 font-bold text-slate-900" : "hover:bg-slate-100")}
                >
                  Name
                </button>
                <button
                  onClick={() => setMemberSortBy("age")}
                  className={cn("px-2 py-1 rounded", memberSortBy === "age" ? "bg-slate-200 font-bold text-slate-900" : "hover:bg-slate-100")}
                >
                  Age
                </button>
                <button
                  onClick={() => setMemberSortBy("verification")}
                  className={cn("px-2 py-1 rounded", memberSortBy === "verification" ? "bg-slate-200 font-bold text-slate-900" : "hover:bg-slate-100")}
                >
                  Status
                </button>
              </div>
            </div>

            {/* Dense Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Member</th>
                    <th className="py-2.5 px-4 font-bold">Relationship</th>
                    <th className="py-2.5 px-4 font-bold">Age</th>
                    <th className="py-2.5 px-4 font-bold">Verification</th>
                    <th className="py-2.5 px-4 font-bold">Documents</th>
                    <th className="py-2.5 px-4 font-bold">Benefits</th>
                    <th className="py-2.5 px-4 font-bold">Issues</th>
                    <th className="py-2.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => openMemberDetails(m)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      {/* Member Name + Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-[11px] shrink-0 border border-slate-200">
                            {m.avatarInitials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <span className="font-mono text-[10px] text-slate-500">{m.publicId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Relationship */}
                      <td className="py-3 px-4">
                        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800">
                          {m.relationship}
                        </span>
                      </td>

                      {/* Age */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {m.age} yrs · {m.gender}
                      </td>

                      {/* Verification */}
                      <td className="py-3 px-4">
                        {m.verificationStatus === "Verified" && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                        {m.verificationStatus === "Under Review" && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 border border-amber-200">
                            <Clock className="h-3 w-3 text-amber-700" />
                            Under Review
                          </span>
                        )}
                        {m.verificationStatus === "Pending" && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-300">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Documents */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {m.documentsCount} verified
                      </td>

                      {/* Benefits */}
                      <td className="py-3 px-4">
                        {m.benefitsCount > 0 ? (
                          <span className="text-teal font-semibold font-mono">
                            {m.benefitsCount} active
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Issues */}
                      <td className="py-3 px-4">
                        {m.openIssuesCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold" title={m.issueDetails || "Review required"}>
                            <AlertCircle className="h-3.5 w-3.5" />
                            {m.openIssuesCount} issue
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">None</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMemberDetails(m);
                          }}
                          className="h-6 text-xs text-gov hover:bg-gov/5 px-2"
                        >
                          View →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footnote */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 p-3 px-4 text-xs text-slate-500 font-mono">
              <span>Showing {filteredMembers.length} of {members.length} members</span>
              <span>All records cross-referenced with civil registry</span>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: TIMELINE (Section 11)                                              */}
        {/* ========================================================================= */}
        <TabsContent value="timeline" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Life Events & Verification Timeline (12)
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable civil milestones, attestation entries, and municipal updates in reverse chronological order.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsReportEventOpen(true)}
                className="h-7 text-xs gap-1 border-slate-300"
              >
                <Calendar className="h-3 w-3 text-slate-500" />
                Report Event
              </Button>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-2 before:w-0.5 before:bg-slate-200">
              {timeline.map((evt) => (
                <div key={evt.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      "absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-2xs",
                      evt.status === "Verified" ? "bg-emerald-600" : evt.status === "Awaiting Review" ? "bg-amber-500" : "bg-gov"
                    )}
                  />

                  {/* Event Card */}
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {evt.date}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {evt.title}
                        </h4>
                      </div>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold border",
                          evt.status === "Verified" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                          evt.status === "Awaiting Review" && "bg-amber-50 text-amber-800 border-amber-300",
                          evt.status === "System Recorded" && "bg-blue-50 text-blue-800 border-blue-300"
                        )}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 font-medium">
                      {evt.subtitle}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                      <span>Source: <strong className="text-slate-700 font-sans">{evt.source}</strong></span>
                      <span>Verified by: <strong className="text-slate-700 font-sans">{evt.verifiedBy}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: APPLICATIONS (Section 14)                                          */}
        {/* ========================================================================= */}
        <TabsContent value="applications" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Statutory Welfare Applications ({applications.length})
              </h3>
              <p className="text-xs text-slate-500">
                Formal claims, subsidy grants, and municipal updates submitted by household members.
              </p>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {app.id}
                      </span>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold border",
                          app.status === "Approved" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                          app.status === "Under Verification" && "bg-amber-50 text-amber-800 border-amber-300",
                          app.status === "In Progress" && "bg-blue-50 text-blue-800 border-blue-300"
                        )}
                      >
                        {app.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{app.scheme}</h4>
                    <p className="text-xs text-slate-600 max-w-xl">{app.details}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                      <span>Submitted: {app.submittedDate}</span>
                      <span>Last Updated: {app.lastUpdated}</span>
                      <span>Applicant: {app.applicant}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsApplicationModalOpen(true);
                      }}
                      className="text-xs bg-gov hover:bg-gov/90 text-white font-medium h-8 px-3"
                    >
                      View Details →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 6: BENEFITS (Section 15)                                              */}
        {/* ========================================================================= */}
        <TabsContent value="benefits" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="border-b pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Active & Sanctioned Benefits ({benefits.length})
              </h3>
              <p className="text-xs text-slate-500">
                Direct benefit transfers, subsidized rations, and health coverage active for Sharma Household.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((ben) => (
                <div
                  key={ben.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                        {ben.category}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                          ben.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        )}
                      >
                        {ben.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{ben.schemeName}</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Beneficiary: <strong className="text-slate-800">{ben.beneficiary}</strong>
                    </p>
                    <div className="mt-3 p-2.5 rounded bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Entitlement:</span>
                        <span className="font-bold text-slate-900 font-mono">{ben.entitlementAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Frequency:</span>
                        <span className="font-medium text-slate-700">{ben.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sanctioned Date:</span>
                        <span className="font-mono text-slate-700">{ben.startDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px]">Direct Treasury Disbursement</span>
                    <span className="font-medium text-teal flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> E-KYC Seeded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 7: DOCUMENTS (Section 16)                                             */}
        {/* ========================================================================= */}
        <TabsContent value="documents" className="pt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Household Document Repository ({documents.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Identity documents, property deeds, municipal receipts, and category certificates.
                </p>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 rounded px-2.5 py-1">
                16 of 18 Verified in Govt Vaults
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-gov/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold uppercase text-slate-500">
                        {doc.type}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[9px] font-bold border",
                          doc.verificationStatus === "Verified" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                          doc.verificationStatus === "Under Review" && "bg-amber-50 text-amber-800 border-amber-200",
                          doc.verificationStatus === "Pending" && "bg-slate-100 text-slate-700 border-slate-300"
                        )}
                      >
                        {doc.verificationStatus}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Owner: <strong>{doc.owner}</strong>
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      No: {doc.documentNumber}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Source: {doc.issuingAuthority}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Verified: {doc.lastVerified}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setIsDocumentModalOpen(true);
                      }}
                      className="h-6 text-xs text-gov hover:bg-gov/5 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" /> Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* 9. MEMBER DETAILS DRAWER (Section 9)                                      */}
      {/* ========================================================================= */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 flex flex-col bg-white">
          {selectedMember && (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-bold text-base shadow-xs">
                      {selectedMember.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {selectedMember.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-gov">
                          {selectedMember.relationship}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-mono text-slate-500">
                          {selectedMember.publicId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-bold border",
                        selectedMember.verificationStatus === "Verified" &&
                          "bg-emerald-50 text-emerald-800 border-emerald-300",
                        selectedMember.verificationStatus === "Under Review" &&
                          "bg-amber-50 text-amber-800 border-amber-300",
                        selectedMember.verificationStatus === "Pending" &&
                          "bg-slate-100 text-slate-700 border-slate-300"
                      )}
                    >
                      {selectedMember.verificationStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Quick Stats Banner (Section 9) */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center font-mono">
                  <div className="rounded bg-white p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Applications</span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedMember.id === "mem-01" ? "2 active" : selectedMember.documentsCount > 0 ? "1 active" : "None"}
                    </span>
                  </div>
                  <div className="rounded bg-white p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Benefits</span>
                    <span className="text-xs font-bold text-teal">
                      {selectedMember.benefitsCount > 0 ? `${selectedMember.benefitsCount} active` : "None"}
                    </span>
                  </div>
                  <div className="rounded bg-white p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Documents</span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedMember.documentsCount} verified
                    </span>
                  </div>
                  <div className="rounded bg-white p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-sans">Issues</span>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        selectedMember.openIssuesCount > 0 ? "text-red-600" : "text-emerald-700"
                      )}
                    >
                      {selectedMember.openIssuesCount > 0 ? `${selectedMember.openIssuesCount} open` : "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Drawer Tabs: Overview, Verification, Documents, Applications, Benefits */}
              <div className="p-6 flex-1">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 text-[11px] h-8 bg-slate-100 p-0.5">
                    <TabsTrigger value="overview" className="text-[11px] py-1">Overview</TabsTrigger>
                    <TabsTrigger value="verification" className="text-[11px] py-1">Verification</TabsTrigger>
                    <TabsTrigger value="docs" className="text-[11px] py-1">Documents</TabsTrigger>
                    <TabsTrigger value="apps" className="text-[11px] py-1">Applications</TabsTrigger>
                    <TabsTrigger value="bens" className="text-[11px] py-1">Benefits</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab Content */}
                  <TabsContent value="overview" className="space-y-4 pt-4 text-xs">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Full Name</span>
                        <span className="font-bold text-slate-900">{selectedMember.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Date of Birth</span>
                        <span className="font-mono text-slate-900">
                          {selectedMember.dob} ({selectedMember.age} years)
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Gender</span>
                        <span className="text-slate-900">{selectedMember.gender}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Mobile Number</span>
                        <span className="font-mono text-slate-900">
                          {selectedMember.mobileNumber || "+91 98765 43210"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Aadhaar Number</span>
                        <span className="font-mono text-slate-900">
                          {selectedMember.aadhaarNumber || "XXXX-XXXX-1234"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Relationship</span>
                        <span className="font-semibold text-slate-900">
                          {selectedMember.relationship}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-medium">Declared Income</span>
                        <span className="font-mono text-slate-900">
                          {selectedMember.declaredIncome || "Not Applicable"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Verification Tab Content */}
                  <TabsContent value="verification" className="space-y-3 pt-4 text-xs">
                    <div className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Identity Verification</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {selectedMember.verificationStatus === "Verified" ? "Verified" : selectedMember.verificationStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Address Verification</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Document Verification</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 font-mono text-[11px]">
                        <span className="text-slate-500">Last Verified</span>
                        <span className="font-bold text-slate-800">
                          {selectedMember.lastVerifiedDate || "18 Oct 2026"}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Documents Tab Content */}
                  <TabsContent value="docs" className="space-y-2 pt-4 text-xs">
                    {documents
                      .filter((d) => d.owner.includes(selectedMember.name.split(" ")[0]))
                      .concat(
                        selectedMember.id === "mem-01"
                          ? documents.slice(0, 4)
                          : documents.slice(0, 1)
                      )
                      .slice(0, 4)
                      .map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-white">
                          <div>
                            <p className="font-bold text-slate-900">{d.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{d.documentNumber}</p>
                          </div>
                          <span className="text-emerald-700 text-[11px] font-semibold">✓ Verified</span>
                        </div>
                      ))}
                  </TabsContent>

                  {/* Applications Tab Content */}
                  <TabsContent value="apps" className="space-y-2 pt-4 text-xs">
                    {selectedMember.id === "mem-01" ? (
                      applications.slice(0, 2).map((a) => (
                        <div key={a.id} className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
                          <div className="flex justify-between">
                            <span className="font-bold font-mono text-slate-900">{a.id}</span>
                            <span className="text-[10px] font-semibold text-gov">{a.status}</span>
                          </div>
                          <p className="font-medium text-slate-800">{a.scheme}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-4">No active member-specific applications.</p>
                    )}
                  </TabsContent>

                  {/* Benefits Tab Content */}
                  <TabsContent value="bens" className="space-y-2 pt-4 text-xs">
                    {benefits.slice(0, 2).map((b) => (
                      <div key={b.id} className="p-2.5 rounded border border-slate-200 bg-white space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900">{b.schemeName}</span>
                          <span className="text-[10px] font-bold text-emerald-700">ACTIVE</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">{b.entitlementAmount} ({b.frequency})</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-8 text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsCorrectionModalOpen(true);
                  }}
                  className="h-8 text-xs bg-gov hover:bg-gov/90 text-white"
                >
                  Request Correction
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ========================================================================= */}
      {/* 4. MODAL: RAISE CORRECTION / DISPUTE (Section 4)                          */}
      {/* ========================================================================= */}
      <Dialog open={isCorrectionModalOpen} onOpenChange={setIsCorrectionModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Correction / Dispute
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Use this process if household information is incorrect. All disputes are reviewed by district civil officers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCorrectionSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="dispute-field" className="text-xs font-semibold text-slate-700">
                Select category to correct
              </Label>
              <Select value={correctionCategory} onValueChange={setCorrectionCategory}>
                <SelectTrigger id="dispute-field" className="text-xs h-9 bg-white">
                  <SelectValue placeholder="Select information category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Identity information">Identity information</SelectItem>
                  <SelectItem value="Relationship">Relationship</SelectItem>
                  <SelectItem value="Address">Address</SelectItem>
                  <SelectItem value="Household status">Household status</SelectItem>
                  <SelectItem value="Property information">Property information</SelectItem>
                  <SelectItem value="Benefit / eligibility information">
                    Benefit / eligibility information
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dispute-desc" className="text-xs font-semibold text-slate-700">
                Details of requested correction
              </Label>
              <Textarea
                id="dispute-desc"
                rows={3}
                placeholder="Explain what is inaccurate and provide correct government details..."
                value={correctionDescription}
                onChange={(e) => setCorrectionDescription(e.target.value)}
                className="text-xs bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dispute-doc" className="text-xs font-semibold text-slate-700">
                Supporting document reference (optional)
              </Label>
              <Input
                id="dispute-doc"
                placeholder="e.g. Nagar Nigam Tax Receipt #88924 / Aadhaar Ref"
                value={correctionDocRef}
                onChange={(e) => setCorrectionDocRef(e.target.value)}
                className="text-xs h-8 bg-white font-mono"
              />
            </div>

            <DialogFooter className="gap-2 pt-2 border-t sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCorrectionModalOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-gov hover:bg-gov/90 text-white font-semibold"
              >
                Start Correction Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4b. MODAL: ADD FAMILY MEMBER                                              */}
      {/* ========================================================================= */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Add Family Member
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Record a new member in household {householdOverviewMock.householdPublicId}. Changes will be queued for municipal attestation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMemberSubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-first-name" className="text-xs font-semibold text-slate-700">
                  Legal First Name
                </Label>
                <Input
                  id="add-first-name"
                  placeholder="e.g. Manav"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="h-8 text-xs bg-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="add-last-name" className="text-xs font-semibold text-slate-700">
                  Legal Last Name
                </Label>
                <Input
                  id="add-last-name"
                  placeholder="e.g. Sharma"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="h-8 text-xs bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-rel" className="text-xs font-semibold text-slate-700">
                  Relationship to Head
                </Label>
                <Select value={newRelationship} onValueChange={setNewRelationship}>
                  <SelectTrigger id="add-rel" className="h-8 text-xs bg-white">
                    <SelectValue placeholder="Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Daughter">Daughter</SelectItem>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Daughter-in-law">Daughter-in-law</SelectItem>
                    <SelectItem value="Dependent">Dependent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="add-gender" className="text-xs font-semibold text-slate-700">
                  Gender
                </Label>
                <Select value={newGender} onValueChange={(val: any) => setNewGender(val)}>
                  <SelectTrigger id="add-gender" className="h-8 text-xs bg-white">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-dob" className="text-xs font-semibold text-slate-700">
                Date of Birth
              </Label>
              <Input
                id="add-dob"
                type="date"
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
                className="h-8 text-xs bg-white font-mono"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2 border-t sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddMemberOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-gov hover:bg-gov/90 text-white font-semibold"
              >
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4c. MODAL: REPORT LIFE EVENT                                              */}
      {/* ========================================================================= */}
      <Dialog open={isReportEventOpen} onOpenChange={setIsReportEventOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Report Civil Life Event
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Report births, marriages, address relocations, or death records for automated entitlement adjustment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportEventSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="event-type" className="text-xs font-semibold text-slate-700">
                Event Type
              </Label>
              <Select value={newEventType} onValueChange={setNewEventType}>
                <SelectTrigger id="event-type" className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Birth of child">Birth of child</SelectItem>
                  <SelectItem value="Marriage registered">Marriage registered</SelectItem>
                  <SelectItem value="Address relocation">Address relocation</SelectItem>
                  <SelectItem value="Income tier change">Income tier change</SelectItem>
                  <SelectItem value="Death of member">Death of member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="event-date" className="text-xs font-semibold text-slate-700">
                  Effective Date
                </Label>
                <Input
                  id="event-date"
                  placeholder="e.g. 24 Oct 2026"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="h-8 text-xs bg-white font-mono"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="event-cert" className="text-xs font-semibold text-slate-700">
                  Certificate / Slip #
                </Label>
                <Input
                  id="event-cert"
                  placeholder="e.g. BC-2026-904"
                  value={newEventCertNo}
                  onChange={(e) => setNewEventCertNo(e.target.value)}
                  className="h-8 text-xs bg-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="event-details" className="text-xs font-semibold text-slate-700">
                Event Summary & Details
              </Label>
              <Textarea
                id="event-details"
                rows={3}
                placeholder="Describe the life event and list impacted household members..."
                value={newEventDetails}
                onChange={(e) => setNewEventDetails(e.target.value)}
                className="text-xs bg-white"
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-2 border-t sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReportEventOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs bg-gov hover:bg-gov/90 text-white font-semibold"
              >
                Log Life Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 10b. MODAL: APPLICATION DETAILS                                           */}
      {/* ========================================================================= */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          {selectedApplication && (
            <div>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {selectedApplication.id}
                  </span>
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-semibold border",
                      selectedApplication.status === "Approved" && "bg-emerald-50 text-emerald-800 border-emerald-300",
                      selectedApplication.status === "Under Verification" && "bg-amber-50 text-amber-800 border-amber-300",
                      selectedApplication.status === "In Progress" && "bg-blue-50 text-blue-800 border-blue-300"
                    )}
                  >
                    {selectedApplication.status}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold text-slate-900 mt-2">
                  {selectedApplication.scheme}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {selectedApplication.department}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-3 text-xs">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800 mb-1">Application Scope</p>
                  <p className="text-slate-600 leading-relaxed">{selectedApplication.details}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase font-mono text-[11px] mb-2">
                    Determination Timeline
                  </h4>
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1 font-mono">
                    {selectedApplication.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div
                          className={cn(
                            "absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full border border-white",
                            step.status === "completed" && "bg-emerald-600",
                            step.status === "current" && "bg-gov animate-pulse",
                            step.status === "upcoming" && "bg-slate-300"
                          )}
                        />
                        <div className="flex justify-between items-center text-xs">
                          <span
                            className={cn(
                              step.status === "completed" && "font-semibold text-slate-800",
                              step.status === "current" && "font-bold text-gov",
                              step.status === "upcoming" && "text-slate-400"
                            )}
                          >
                            {step.stage}
                          </span>
                          <span className="text-[11px] text-slate-500">{step.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsApplicationModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 16b. MODAL: DOCUMENT PREVIEW / INSPECT                                    */}
      {/* ========================================================================= */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          {selectedDocument && (
            <div>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                    {selectedDocument.type}
                  </span>
                  <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-300">
                    {selectedDocument.verificationStatus}
                  </span>
                </div>
                <DialogTitle className="text-base font-bold text-slate-900 mt-1">
                  {selectedDocument.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-mono">
                  Doc Ref: {selectedDocument.documentNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Owner:</span>
                  <span className="font-bold text-slate-900">{selectedDocument.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="font-semibold text-slate-800">{selectedDocument.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Verified Date:</span>
                  <span className="font-mono text-slate-800">{selectedDocument.lastVerified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Digital Seal:</span>
                  <span className="text-emerald-700 font-mono font-bold">SHA256-DIGITAL-SIGN-OK</span>
                </div>
              </div>

              <DialogFooter className="pt-3 border-t mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDocumentModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 3b. MODAL: ADDRESS CORRECTION CASE PREVIEW                                */}
      {/* ========================================================================= */}
      <Dialog open={isCaseModalOpen} onOpenChange={setIsCaseModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Address Correction Case #CAS-2026-0041
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Dispute logged regarding ward re-demarcation and property record alignment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded border border-blue-200 bg-blue-50/40">
              <p className="font-bold text-gov">Status: Under Municipal Officer Review</p>
              <p className="text-slate-600 mt-1">
                Field verification scheduled to cross-reference House No. 42 against Nagar Palika Ward 7 cadastral boundary map.
              </p>
            </div>
            <div className="text-slate-500 space-y-1 font-mono text-[11px]">
              <p>Current: House No. 42, Ward 7, Demo District, UP — 201001</p>
              <p>Submitted: 22 Oct 2026 by Rajesh Sharma</p>
            </div>
          </div>
          <DialogFooter className="pt-3 border-t mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCaseModalOpen(false)}
              className="h-8 text-xs"
            >
              Close Case View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
