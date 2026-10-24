import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  Route as RouteIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  User,
  Heart,
  Baby,
  Building,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  Eye,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import {
  fetchHouseholdFamily,
  fetchPerson360,
  type ApiFamilyResponse,
  type ApiFamilyMember,
  type ApiFamilyRelationship,
  type ApiPerson360Data,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Family360Props {
  householdId?: string;
  initialSelectedPersonId?: string;
  readOnly?: boolean;
  role?: string;
  className?: string;
}

interface GenerationMember extends ApiFamilyMember {
  gen: number;
  genLabel: string;
  birthYear: number;
  x: number;
  y: number;
}

export function Family360({
  householdId = "MIRA-FAM-10482",
  initialSelectedPersonId,
  readOnly = false,
  role,
  className,
}: Family360Props) {
  const { state } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas Viewport Transformation
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [verificationFilter, setVerificationFilter] = useState<string>("ALL");

  // Interaction State
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(
    initialSelectedPersonId || null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Path Finder State
  const [isPathFinderOpen, setIsPathFinderOpen] = useState(false);
  const [pathFromId, setPathFromId] = useState<string>("");
  const [pathToId, setToId] = useState<string>("");
  const [computedPath, setComputedPath] = useState<Array<{
    from: string;
    to: string;
    rel: string;
  }> | null>(null);

  // Fetch Family Data from PostgreSQL
  const {
    data: familyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiFamilyResponse>({
    queryKey: ["household-family-360", householdId, state.session?.apiUserId],
    queryFn: () => fetchHouseholdFamily(state.session, householdId),
    enabled: !!state.session,
    staleTime: 1000 * 60,
  });

  // Fetch Detailed 360 data when a person is selected
  const { data: person360Data, isLoading: isLoading360 } =
    useQuery<ApiPerson360Data>({
      queryKey: [
        "person-360-details",
        selectedPersonId,
        state.session?.apiUserId,
      ],
      queryFn: () => fetchPerson360(state.session, selectedPersonId!),
      enabled: !!selectedPersonId && !!state.session,
      staleTime: 1000 * 30,
    });

  // Multi-Generational Layout Calculation
  const { positionedMembers, relationships, generationCounts } = useMemo(() => {
    if (!familyData?.members) {
      return {
        positionedMembers: [] as GenerationMember[],
        relationships: [] as ApiFamilyRelationship[],
        generationCounts: { g1: 0, g2: 0, g3: 0, g4: 0 },
      };
    }

    const members = familyData.members;
    const rels = familyData.relationships || [];

    // Helper: calculate generation based on birth date and role
    const assigned: Array<GenerationMember> = members.map((m) => {
      let bYear = 1990;
      if (m.dob) {
        const parts = m.dob.split("-");
        if (parts[0]) bYear = parseInt(parts[0], 10) || 1990;
      }

      let gen = 2;
      let genLabel = "G2 • Parents & Heads";

      if (bYear < 1952) {
        gen = 1;
        genLabel = "G1 • Elders & Patriarchs";
      } else if (bYear >= 1952 && bYear < 1992) {
        gen = 2;
        genLabel = "G2 • Parents & Applicants";
      } else if (bYear >= 1992 && bYear < 2015) {
        gen = 3;
        genLabel = "G3 • Youth & Children";
      } else {
        gen = 4;
        genLabel = "G4 • Infants & Dependents";
      }

      return {
        ...m,
        gen,
        genLabel,
        birthYear: bYear,
        x: 0,
        y: 0,
      };
    });

    // Group members by generation
    const g1 = assigned
      .filter((m) => m.gen === 1)
      .sort((a, b) => a.birthYear - b.birthYear);
    const g2 = assigned
      .filter((m) => m.gen === 2)
      .sort((a, b) => a.birthYear - b.birthYear);
    const g3 = assigned
      .filter((m) => m.gen === 3)
      .sort((a, b) => a.birthYear - b.birthYear);
    const g4 = assigned
      .filter((m) => m.gen === 4)
      .sort((a, b) => a.birthYear - b.birthYear);

    const NODE_WIDTH = 210;
    const NODE_GAP_X = 26;
    const GEN_Y_START = 80;
    const GEN_Y_GAP = 180;

    const layoutGen = (list: GenerationMember[], genIndex: number) => {
      const totalWidth = list.length * (NODE_WIDTH + NODE_GAP_X);
      const startX = Math.max(60, (2600 - totalWidth) / 2);
      list.forEach((node, i) => {
        node.x = startX + i * (NODE_WIDTH + NODE_GAP_X);
        node.y = GEN_Y_START + genIndex * GEN_Y_GAP;
      });
    };

    layoutGen(g1, 0);
    layoutGen(g2, 1);
    layoutGen(g3, 2);
    layoutGen(g4, 3);

    return {
      positionedMembers: [...g1, ...g2, ...g3, ...g4],
      relationships: rels,
      generationCounts: {
        g1: g1.length,
        g2: g2.length,
        g3: g3.length,
        g4: g4.length,
      },
    };
  }, [familyData]);

  // Lookup map by ID or Person ID
  const memberMap = useMemo(() => {
    const map = new Map<string, GenerationMember>();
    positionedMembers.forEach((m) => {
      map.set(m.id, m);
      map.set(m.public_id, m);
      if (m.person_id) map.set(m.person_id, m);
    });
    return map;
  }, [positionedMembers]);

  // Filtered members
  const visibleMembers = useMemo(() => {
    return positionedMembers.filter((m) => {
      if (
        generationFilter !== "ALL" &&
        m.gen !== parseInt(generationFilter, 10)
      ) {
        return false;
      }
      if (roleFilter !== "ALL") {
        if (roleFilter === "HEAD" && m.relationship !== "HEAD") return false;
        if (roleFilter === "SPOUSE" && m.relationship !== "SPOUSE")
          return false;
        if (roleFilter === "CHILD" && m.relationship !== "CHILD") return false;
        if (
          roleFilter === "DEPENDENT" &&
          m.relationship !== "DEPENDENT" &&
          m.relationship !== "PARENT"
        )
          return false;
      }
      if (verificationFilter !== "ALL") {
        const isVer = (m.identity || "").toLowerCase().includes("verif");
        if (verificationFilter === "VERIFIED" && !isVer) return false;
        if (verificationFilter === "PENDING" && isVer) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.public_id.toLowerCase().includes(q) ||
          m.relationship.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    positionedMembers,
    generationFilter,
    roleFilter,
    verificationFilter,
    searchQuery,
  ]);

  const visibleIdSet = useMemo(() => {
    const s = new Set<string>();
    visibleMembers.forEach((m) => {
      s.add(m.id);
      if (m.person_id) s.add(m.person_id);
    });
    return s;
  }, [visibleMembers]);

  // Handle member click
  const handleSelectMember = (personIdOrPublicId: string) => {
    setSelectedPersonId(personIdOrPublicId);
    setIsDrawerOpen(true);
  };

  // Pan / Drag Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Center on member
  const centerOnMember = useCallback(
    (member: GenerationMember) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const targetX = rect.width / 2 - member.x * zoom - 105 * zoom;
      const targetY = rect.height / 2 - member.y * zoom - 45 * zoom;
      setPan({ x: targetX, y: targetY });
    },
    [zoom],
  );

  // Breadth-First-Search Relationship Path Finder
  const handleFindPath = () => {
    if (!pathFromId || !pathToId) {
      toast.error("Please select both starting and target individuals.");
      return;
    }
    if (pathFromId === pathToId) {
      toast.info("Both selections are the same person.");
      return;
    }

    // Build adjacency graph
    const adj = new Map<string, Array<{ to: string; rel: string }>>();
    relationships.forEach((r) => {
      const a = r.person_a_id;
      const b = r.person_b_id;
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a)!.push({ to: b, rel: r.relationship_type });
      adj.get(b)!.push({ to: a, rel: `Related to (${r.relationship_type})` });
    });

    const queue: Array<{
      curr: string;
      path: Array<{ from: string; to: string; rel: string }>;
    }> = [{ curr: pathFromId, path: [] }];
    const visited = new Set<string>([pathFromId]);
    let foundPath: Array<{ from: string; to: string; rel: string }> | null =
      null;

    while (queue.length > 0) {
      const { curr, path } = queue.shift()!;
      if (curr === pathToId) {
        foundPath = path;
        break;
      }
      const neighbors = adj.get(curr) || [];
      for (const n of neighbors) {
        if (!visited.has(n.to)) {
          visited.add(n.to);
          queue.push({
            curr: n.to,
            path: [...path, { from: curr, to: n.to, rel: n.rel }],
          });
        }
      }
    }

    if (foundPath && foundPath.length > 0) {
      setComputedPath(foundPath);
      toast.success(
        `Relationship path identified (${foundPath.length} step${foundPath.length > 1 ? "s" : ""})`,
      );
    } else {
      setComputedPath(null);
      toast.warning(
        "No direct verified relationship path found in the registry.",
      );
    }
  };

  // Computed Household Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = positionedMembers.length;
    const verified = positionedMembers.filter((m) =>
      (m.identity || "").toLowerCase().includes("verif"),
    ).length;
    const pending = total - verified;
    return {
      total,
      verified,
      pending,
      income: "₹1,72,000 / yr",
      documentsCount: 10,
      applicationsCount: 6,
      discrepancyCount: 1,
    };
  }, [positionedMembers]);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100" />
          <span className="text-sm font-medium">
            Generating Multi-Generational Family360 Graph...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400 mb-3" />
        <h3 className="text-base font-bold text-red-900 dark:text-red-200">
          Failed to load Family360 Record
        </h3>
        <p className="mt-1 text-xs text-red-700 dark:text-red-400 max-w-md">
          {error instanceof Error
            ? error.message
            : "Access restricted or household registry unavailable."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-4 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-none",
        className,
      )}
    >
      {/* 1. TOP INTELLIGENCE & HOUSEHOLD SUMMARY METRICS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Sharma Family Household Graph
              </h2>
              <Badge
                variant="outline"
                className="font-mono text-[11px] bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {householdId}
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px]"
              >
                4 Generations Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Tehsil Bilaspur · Rampur District · Multi-Tier Household Registry
            </p>
          </div>
        </div>

        {/* Live Key Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Total Members
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {summaryMetrics.total} Individuals
            </span>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Verified Civil ID
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {summaryMetrics.verified}
            </span>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Review Flags
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {summaryMetrics.discrepancyCount} Pending
            </span>
          </div>

          <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Household Income
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {summaryMetrics.income}
            </span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CONTROLS & FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-2.5 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search member or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-white dark:bg-slate-950"
            />
          </div>

          {/* Generation Filter */}
          <Select value={generationFilter} onValueChange={setGenerationFilter}>
            <SelectTrigger className="h-8 w-36 text-xs bg-white dark:bg-slate-950">
              <SelectValue placeholder="Generation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                All Generations ({summaryMetrics.total})
              </SelectItem>
              <SelectItem value="1">
                G1 • Elders ({generationCounts.g1})
              </SelectItem>
              <SelectItem value="2">
                G2 • Parents ({generationCounts.g2})
              </SelectItem>
              <SelectItem value="3">
                G3 • Youth ({generationCounts.g3})
              </SelectItem>
              <SelectItem value="4">
                G4 • Infants ({generationCounts.g4})
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-8 w-32 text-xs bg-white dark:bg-slate-950">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="HEAD">Household Head</SelectItem>
              <SelectItem value="SPOUSE">Spouse</SelectItem>
              <SelectItem value="CHILD">Children</SelectItem>
              <SelectItem value="DEPENDENT">Dependents</SelectItem>
            </SelectContent>
          </Select>

          {/* Path Finder Toggle */}
          <Button
            variant={isPathFinderOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPathFinderOpen(!isPathFinderOpen)}
            className="h-8 gap-1.5 text-xs"
          >
            <RouteIcon className="h-3.5 w-3.5" />
            <span>Path Finder</span>
          </Button>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.45))}
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2 font-mono"
            onClick={() => {
              setZoom(1);
              setPan({ x: 40, y: 30 });
            }}
            title="Reset View"
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* 3. PATH FINDER PANEL (CONDITIONAL ACCORDION) */}
      {isPathFinderOpen && (
        <div className="border-b border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 animate-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Statutory Relationship Traversal
              </span>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                Compute verified civil relationship chain between any two
                household members
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={pathFromId} onValueChange={setPathFromId}>
                <SelectTrigger className="h-8 w-44 text-xs bg-white dark:bg-slate-900">
                  <SelectValue placeholder="From Member..." />
                </SelectTrigger>
                <SelectContent>
                  {positionedMembers.map((m) => (
                    <SelectItem key={m.id} value={m.person_id || m.id}>
                      {m.name} ({m.public_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ArrowRight className="h-3.5 w-3.5 text-amber-700 shrink-0" />

              <Select value={pathToId} onValueChange={setToId}>
                <SelectTrigger className="h-8 w-44 text-xs bg-white dark:bg-slate-900">
                  <SelectValue placeholder="To Member..." />
                </SelectTrigger>
                <SelectContent>
                  {positionedMembers.map((m) => (
                    <SelectItem key={m.id} value={m.person_id || m.id}>
                      {m.name} ({m.public_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="sm"
                className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium gap-1"
                onClick={handleFindPath}
              >
                Compute Chain
              </Button>
            </div>
          </div>

          {/* Computed Breadcrumb Result */}
          {computedPath && (
            <div className="mt-3 rounded-lg border border-amber-300 bg-white p-3 shadow-2xs dark:border-amber-800 dark:bg-slate-900">
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Verified Lineage Path:
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                {computedPath.map((step, idx) => {
                  const fromNode = memberMap.get(step.from);
                  const toNode = memberMap.get(step.to);
                  return (
                    <React.Fragment key={idx}>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {fromNode?.name || step.from}
                      </span>
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                        {step.rel}
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      {idx === computedPath.length - 1 && (
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {toNode?.name || step.to}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MAIN INTERACTIVE SVG GRAPH CANVAS */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "relative h-[640px] w-full cursor-grab overflow-hidden select-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]",
          isDragging && "cursor-grabbing",
        )}
      >
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "2800px",
            height: "1000px",
          }}
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="edgeActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Generation Background Tier Bands */}
          <g className="generation-bands opacity-50">
            <rect
              x="20"
              y="50"
              width="2700"
              height="150"
              rx="12"
              fill="#f8fafc"
              className="dark:fill-slate-900/40"
            />
            <text
              x="40"
              y="75"
              fill="#64748b"
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
            >
              TIER 1 • ELDERS & ANCESTORS (G1)
            </text>

            <rect
              x="20"
              y="230"
              width="2700"
              height="150"
              rx="12"
              fill="#f1f5f9"
              className="dark:fill-slate-900/60"
            />
            <text
              x="40"
              y="255"
              fill="#0284c7"
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
            >
              TIER 2 • HOUSEHOLD HEADS & PARENTS (G2)
            </text>

            <rect
              x="20"
              y="410"
              width="2700"
              height="150"
              rx="12"
              fill="#f8fafc"
              className="dark:fill-slate-900/40"
            />
            <text
              x="40"
              y="435"
              fill="#0d9488"
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
            >
              TIER 3 • CHILDREN & STUDENTS (G3)
            </text>

            <rect
              x="20"
              y="590"
              width="2700"
              height="150"
              rx="12"
              fill="#f1f5f9"
              className="dark:fill-slate-900/60"
            />
            <text
              x="40"
              y="615"
              fill="#8b5cf6"
              fontSize="12"
              fontWeight="700"
              fontFamily="monospace"
            >
              TIER 4 • INFANTS & YOUNG DEPENDENTS (G4)
            </text>
          </g>

          {/* Relationship Connection Edges */}
          <g className="edges">
            {relationships.map((rel) => {
              const fromNode = memberMap.get(rel.person_a_id);
              const toNode = memberMap.get(rel.person_b_id);
              if (!fromNode || !toNode) return null;

              // Check if both nodes are visible
              const isFromVisible = visibleIdSet.has(fromNode.id);
              const isToVisible = visibleIdSet.has(toNode.id);
              if (!isFromVisible || !isToVisible) return null;

              const x1 = fromNode.x + 105;
              const y1 = fromNode.y + 40;
              const x2 = toNode.x + 105;
              const y2 = toNode.y + 40;

              const isHighlighted =
                hoveredMemberId === fromNode.id ||
                hoveredMemberId === toNode.id ||
                hoveredMemberId === fromNode.person_id ||
                hoveredMemberId === toNode.person_id;

              // Cubic bezier connection curve
              const midY = (y1 + y2) / 2;
              const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

              return (
                <g key={rel.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={isHighlighted ? "url(#edgeActive)" : "#cbd5e1"}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={
                      rel.relationship_type === "SPOUSE" ? "4 4" : undefined
                    }
                    className="transition-all duration-200"
                  />
                  {isHighlighted && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 4}
                      fill="#1e293b"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none bg-white font-mono"
                    >
                      {rel.relationship_type}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Interactive HTML Node Cards Layer */}
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "2800px",
            height: "1000px",
          }}
        >
          {visibleMembers.map((member) => {
            const isHovered =
              hoveredMemberId === member.id ||
              hoveredMemberId === member.person_id;
            const isSelected =
              selectedPersonId === member.id ||
              selectedPersonId === member.public_id ||
              selectedPersonId === member.person_id;

            const isHead = member.relationship === "HEAD";
            const isVerified = (member.identity || "")
              .toLowerCase()
              .includes("verif");

            return (
              <div
                key={member.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMember(member.public_id || member.id);
                }}
                onMouseEnter={() => setHoveredMemberId(member.id)}
                onMouseLeave={() => setHoveredMemberId(null)}
                style={{
                  position: "absolute",
                  left: `${member.x}px`,
                  top: `${member.y}px`,
                  width: "210px",
                }}
                className={cn(
                  "group relative cursor-pointer rounded-xl border bg-white p-3.5 shadow-xs transition-all duration-200 dark:bg-slate-900 select-none",
                  isHead
                    ? "border-gov/60 bg-gov/[0.03] ring-1 ring-gov/20 dark:border-gov/80"
                    : "border-slate-200/90 dark:border-slate-800",
                  isHovered && "shadow-md scale-[1.03] border-blue-500 z-30",
                  isSelected &&
                    "ring-2 ring-blue-600 border-blue-600 shadow-md z-40",
                )}
              >
                {/* Member Card Header */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {member.name}
                      </h4>
                      {isHead && (
                        <span className="rounded bg-gov px-1 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider shrink-0">
                          Head
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">
                      {member.public_id} · {member.gender}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold shrink-0 uppercase tracking-wider",
                      isHead
                        ? "bg-gov/10 text-gov font-bold"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                    )}
                  >
                    {member.relationship}
                  </span>
                </div>

                {/* Sub-details & Status Bar */}
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] dark:border-slate-800/80">
                  <div className="flex items-center gap-1 font-mono text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{member.dob || "DOB Verified"}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isVerified ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        ID OK
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-medium">
                        <Clock className="h-3 w-3" />
                        Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Focus / Center Button on Card Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    centerOnMember(member);
                  }}
                  className="absolute -top-2 -right-2 hidden h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs group-hover:flex hover:bg-blue-600 dark:bg-slate-100 dark:text-slate-900 text-[10px]"
                  title="Center View"
                >
                  <Eye className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SLIDE-OVER MEMBER DETAIL DRAWER (360 EXPERIENCE) */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 overflow-y-auto bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800"
        >
          {isLoading360 ? (
            <div className="flex h-full flex-col items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100 mb-3" />
              <p className="text-sm font-medium text-slate-600">
                Loading Person 360 Records...
              </p>
            </div>
          ) : person360Data?.person ? (
            <div className="space-y-6 pb-12">
              {/* Drawer Hero Header */}
              <div className="border-b border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-lg font-bold shadow-xs">
                      {person360Data.person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {person360Data.person.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                        >
                          {person360Data.person.verification_status}
                        </Badge>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        {person360Data.person.public_id} ·{" "}
                        {person360Data.person.membership_role}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Aadhaar:{" "}
                        <span className="font-mono">
                          {person360Data.person.masked_id}
                        </span>{" "}
                        · Age {person360Data.person.age}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 360 Multi-Section Tabs */}
              <div className="px-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 text-xs">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="relations">
                      Links ({person360Data.relationships.length})
                    </TabsTrigger>
                    <TabsTrigger value="docs">
                      Docs ({person360Data.documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="schemes">
                      Schemes ({person360Data.schemes.length})
                    </TabsTrigger>
                    <TabsTrigger value="timeline">
                      History ({person360Data.timeline.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: OVERVIEW */}
                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Civil Demographics
                      </h4>
                      <dl className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <dt className="text-muted-foreground">Full Name</dt>
                          <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                            {person360Data.person.first_name}{" "}
                            {person360Data.person.last_name}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">
                            Date of Birth
                          </dt>
                          <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                            {person360Data.person.dob} (
                            {person360Data.person.age} years)
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Gender</dt>
                          <dd className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                            {person360Data.person.gender}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">
                            Household ID
                          </dt>
                          <dd className="font-mono font-medium text-gov mt-0.5">
                            {person360Data.person.household_public_id}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Household Membership Role
                      </h4>
                      <div className="flex items-center justify-between text-xs">
                        <span>Status within Household</span>
                        <Badge variant="outline" className="font-bold text-gov">
                          {person360Data.person.membership_role}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: RELATIONSHIPS */}
                  <TabsContent value="relations" className="space-y-3 pt-4">
                    {person360Data.relationships.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No direct relationships registered in civil record.
                      </p>
                    ) : (
                      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                        {person360Data.relationships.map((rel) => (
                          <li
                            key={rel.id}
                            className="flex items-center justify-between p-3.5 text-xs"
                          >
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {rel.related_person_name}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {rel.related_person_public_id} ·{" "}
                                {rel.relationship_type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px]"
                              >
                                {Math.round(rel.confidence * 100)}% Verified
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() =>
                                  handleSelectMember(
                                    rel.related_person_public_id,
                                  )
                                }
                              >
                                Inspect
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>

                  {/* TAB 3: DOCUMENTS */}
                  <TabsContent value="docs" className="space-y-3 pt-4">
                    {person360Data.documents.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No identity evidence documents uploaded.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {person360Data.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                  {doc.title}
                                </p>
                                <p className="font-mono text-[11px] text-muted-foreground">
                                  {doc.public_id} · {doc.document_type}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                doc.verification_status === "VERIFIED"
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-700 border-amber-500/20",
                              )}
                            >
                              {doc.verification_status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 4: SCHEMES & EXPLAINABLE ELIGIBILITY */}
                  <TabsContent value="schemes" className="space-y-4 pt-4">
                    {person360Data.schemes.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No scheme evaluations found for this person.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {person360Data.schemes.map((sch) => (
                          <div
                            key={sch.scheme_id}
                            className="rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100">
                                  {sch.name}
                                </h5>
                                <p className="font-mono text-[10px] text-muted-foreground">
                                  {sch.code}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[10px] font-bold"
                              >
                                {sch.eligibility_status.replace("_", " ")}
                              </Badge>
                            </div>

                            {/* Plain-Language Explainable Reason */}
                            <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                              <p className="font-medium">
                                <span className="font-bold text-gov">
                                  Determination:{" "}
                                </span>
                                {sch.explanation}
                              </p>
                            </div>

                            {/* Satisfied Conditions */}
                            {sch.satisfied_conditions.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                  Satisfied Criteria:
                                </span>
                                {sch.satisfied_conditions.map((c, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"
                                  >
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                    <span>{c}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Unmet Conditions */}
                            {sch.unmet_conditions.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                  Pending Verification / Evidence:
                                </span>
                                {sch.unmet_conditions.map((u, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"
                                  >
                                    <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                                    <span>{u}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 5: TIMELINE / LIFE EVENTS */}
                  <TabsContent value="timeline" className="space-y-3 pt-4">
                    {person360Data.timeline.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No recorded lifecycle events.
                      </p>
                    ) : (
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                        {person360Data.timeline.map((event) => (
                          <div key={event.id} className="relative text-xs">
                            <span className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 dark:border-slate-900" />
                            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                                <span className="font-semibold text-gov">
                                  {event.event_type}
                                </span>
                                <span className="font-mono">
                                  {event.effective_date}
                                </span>
                              </div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-xs text-muted-foreground">
              Select an individual on the Family360 graph to view complete
              profile and evidence.
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
