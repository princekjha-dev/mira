import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { fetchApplications, fetchBenefits } from "@/lib/api";
import type { Application, Benefit } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Empty,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/benefits")({
  head: () => ({
    meta: [
      { title: "Benefits and assistance — Mira" },
      {
        name: "description",
        content:
          "View benefits available to your household and track support received.",
      },
    ],
  }),
  component: Benefits,
});

const ALL = "all";
const statusStyle: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Disbursed: "border-teal-200 bg-teal-50 text-teal-800",
  Completed: "border-slate-200 bg-slate-100 text-slate-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-900",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-900",
  Suspended: "border-orange-200 bg-orange-50 text-orange-900",
  Rejected: "border-rose-200 bg-rose-50 text-rose-800",
  Expired: "border-slate-200 bg-slate-100 text-slate-700",
};
const inProgress = (app: Application) =>
  !["Draft", "Approved", "Rejected"].includes(app.status);
const asDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

function Benefits() {
  const { state } = useApp();
  const session = state.session;
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [member, setMember] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [type, setType] = useState(ALL);

  const refresh = useCallback(async () => {
    if (!session?.apiToken) {
      setBenefits([]);
      setApplications([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const [loadedBenefits, loadedApplications] = await Promise.all([
        fetchBenefits(session),
        fetchApplications(session),
      ]);
      setBenefits(loadedBenefits);
      setApplications(loadedApplications);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const members = useMemo(
    () => [...new Set(benefits.map((benefit) => benefit.beneficiary))],
    [benefits],
  );
  const years = useMemo(
    () =>
      [
        ...new Set(
          benefits
            .map((benefit) => benefit.approvedOn.slice(0, 4))
            .filter(Boolean),
        ),
      ]
        .sort()
        .reverse(),
    [benefits],
  );
  const filtered = useMemo(
    () =>
      benefits.filter(
        (benefit) =>
          (member === ALL || benefit.beneficiary === member) &&
          (year === ALL || benefit.approvedOn.startsWith(year)) &&
          (type === ALL || benefit.type === type),
      ),
    [benefits, member, year, type],
  );

  const active = benefits.filter(
    (benefit) => benefit.status === "Active" || benefit.status === "Approved",
  ).length;
  const received = benefits.filter(
    (benefit) =>
      benefit.status === "Disbursed" || benefit.status === "Completed",
  ).length;
  const applicationsInProgress = applications.filter(inProgress).length;
  const pendingActions = applications.filter((app) =>
    ["Verification Required", "Additional Evidence Required"].includes(
      app.status,
    ),
  ).length;
  const summary = [
    { label: "Active benefits", value: active, icon: CircleDollarSign },
    {
      label: "Applications in progress",
      value: applicationsInProgress,
      icon: FileCheck2,
    },
    { label: "Benefits received", value: received, icon: CalendarDays },
    { label: "Pending actions", value: pendingActions, icon: RefreshCw },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="YOUR BENEFITS"
        title="Benefits and assistance"
        desc="View the welfare benefits available to your household and track the support you've received."
      />
      {!session?.apiToken ? (
        <Empty
          title="Sign in to view your benefits"
          body="Your benefit history is private and will appear here after you sign in."
          action={
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      ) : (
        <>
          {loading && benefits.length === 0 ? (
            <LoadingState label="Loading your benefits…" />
          ) : error ? (
            <ErrorState onRetry={() => void refresh()} />
          ) : (
            <>
              <section
                aria-label="Benefits overview"
                className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
              >
                {summary.map(({ label, value, icon: Icon }) => (
                  <Panel key={label} className="shadow-none">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-stone-100 text-slate-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-2xl font-semibold tracking-tight text-slate-950">
                          {value}
                        </p>
                        <p className="text-xs text-slate-600">{label}</p>
                      </div>
                    </div>
                  </Panel>
                ))}
              </section>
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Your benefit history
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Records currently available for your account.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <div>
                    <Label
                      htmlFor="benefit-member"
                      className="text-xs text-slate-600"
                    >
                      Beneficiary
                    </Label>
                    <Select value={member} onValueChange={setMember}>
                      <SelectTrigger
                        id="benefit-member"
                        className="mt-1 w-full sm:w-48"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All people</SelectItem>
                        {members.map((name) => (
                          <SelectItem value={name} key={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="benefit-year"
                      className="text-xs text-slate-600"
                    >
                      Year
                    </Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger
                        id="benefit-year"
                        className="mt-1 w-full sm:w-32"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All years</SelectItem>
                        {years.map((item) => (
                          <SelectItem value={item} key={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="benefit-type"
                      className="text-xs text-slate-600"
                    >
                      Benefit type
                    </Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger
                        id="benefit-type"
                        className="mt-1 w-full sm:w-36"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All types</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Household">Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {loading ? (
                <LoadingState label="Refreshing benefits…" />
              ) : filtered.length === 0 ? (
                benefits.length === 0 ? (
                  <Empty
                    title="No benefits yet"
                    body="You don't have any recorded benefits yet. Eligible benefits and approved assistance will appear here."
                    action={
                      <Button variant="outline" onClick={() => void refresh()}>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </Button>
                    }
                  />
                ) : (
                  <Empty
                    title="No benefits match these filters"
                    body="Change a filter to see more of your benefit history."
                  />
                )
              ) : (
                <ul className="space-y-3">
                  {filtered.map((benefit) => (
                    <li key={benefit.ref}>
                      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-blue-700">
                              {benefit.type} benefit
                            </p>
                            <h3 className="mt-1 text-base font-semibold text-slate-950">
                              {benefit.scheme}
                            </h3>
                            {benefit.department && (
                              <p className="mt-1 text-sm text-slate-600">
                                {benefit.department}
                              </p>
                            )}
                          </div>
                          <span
                            className={`w-fit border px-2 py-1 text-xs font-medium ${statusStyle[benefit.status] || statusStyle.Pending}`}
                          >
                            {benefit.status}
                          </span>
                        </div>
                        <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <dt className="text-xs text-slate-500">
                              Beneficiary
                            </dt>
                            <dd className="mt-1 font-medium text-slate-800">
                              {benefit.beneficiary}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500">Approved</dt>
                            <dd className="mt-1 text-slate-800">
                              {asDate(benefit.approvedOn)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-slate-500">
                              Reference
                            </dt>
                            <dd className="mt-1 break-all font-mono text-xs text-slate-700">
                              {benefit.ref}
                            </dd>
                          </div>
                          {benefit.amount !== null &&
                            benefit.amount !== undefined && (
                              <div>
                                <dt className="text-xs text-slate-500">
                                  Benefit value
                                </dt>
                                <dd className="mt-1 font-medium text-slate-800">
                                  {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: benefit.currency || "INR",
                                    maximumFractionDigits: 0,
                                  }).format(benefit.amount)}
                                </dd>
                              </div>
                            )}
                          {benefit.validTo && (
                            <div>
                              <dt className="text-xs text-slate-500">
                                Valid through
                              </dt>
                              <dd className="mt-1 text-slate-800">
                                {asDate(benefit.validTo)}
                              </dd>
                            </div>
                          )}
                        </dl>
                        {benefit.applicationId && (
                          <div className="mt-4 border-t border-slate-100 pt-3">
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-blue-700"
                              asChild
                            >
                              <Link
                                to="/citizen/applications/$id"
                                params={{ id: benefit.applicationId }}
                              >
                                View related application{" "}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
