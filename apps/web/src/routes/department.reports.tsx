import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";
import { Reports } from "@/components/gov/Reports";

export const Route = createFileRoute("/department/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Department" },
      {
        name: "description",
        content: "Application and duplicate alert reports.",
      },
      { property: "og:title", content: "Department Reports" },
      { property: "og:description", content: "Department reports." },
    ],
  }),
  component: R,
});

function R() {
  const { state } = useApp();
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" />
      <Reports />
      <Panel title="Duplicate alerts by outcome">
        <ul className="space-y-2 text-sm">
          {state.alerts.map((a) => (
            <li key={a.id} className="flex justify-between">
              <span>
                {a.id} · {a.applicant} · {a.scheme}
              </span>
              <Pill>{a.status}</Pill>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
