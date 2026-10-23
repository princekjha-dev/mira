import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users, MapPin, ShieldCheck, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/department/departments")({
  head: () => ({
    meta: [
      { title: "Directorate & Jurisdictional Directory — Department" },
      { name: "description", content: "Directory of state directorates, district welfare offices, and block nodes." },
    ],
  }),
  component: DeptDirectoriesPage,
});

function DeptDirectoriesPage() {
  const depts = [
    {
      name: "Directorate of Rural Development",
      district: "Lucknow HQ",
      head: "Arjun Mehta (Director General)",
      schemes: 12,
      officers: 340,
      slaRate: "97.4%",
      status: "Operational",
    },
    {
      name: "District Welfare Office — Chandauli",
      district: "Chandauli Rural & Urban",
      head: "Vikramaditya Rao (District Magistrate / CWO)",
      schemes: 8,
      officers: 42,
      slaRate: "94.8%",
      status: "Operational",
    },
    {
      name: "Department of Revenue & Land Records",
      district: "UP State Center",
      head: "Suresh P. Tiwari (Principal Secretary)",
      schemes: 4,
      officers: 680,
      slaRate: "99.1%",
      status: "Operational",
    },
    {
      name: "Food & Civil Supplies Department (NFSA)",
      district: "State Distribution Node",
      head: "Meenakshi Sundaram (Commissioner)",
      schemes: 3,
      officers: 512,
      slaRate: "98.2%",
      status: "Operational",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Directorate & Jurisdictional Directory"
        desc="State public service infrastructure nodes, jurisdictional administrative hierarchies, and officer allocations."
        crumbs={[{ label: "Department", to: "/department/dashboard" }, { label: "Directorates" }]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {depts.map((d) => (
          <Card key={d.name} className="border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30 bg-teal-500/10">
                    <ShieldCheck className="mr-1 h-3 w-3" /> {d.status}
                  </Badge>
                  <CardTitle className="text-base font-semibold">{d.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{d.district}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Officer-in-Charge:</span>
                <span className="font-medium text-foreground">{d.head}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-2.5 text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground">Active Schemes</div>
                  <div className="font-bold text-foreground text-sm">{d.schemes}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Field Officers</div>
                  <div className="font-bold text-foreground text-sm">{d.officers}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">SLA Compliance</div>
                  <div className="font-bold text-teal-600 text-sm">{d.slaRate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
