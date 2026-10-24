import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/department/integrations")({
  head: () => ({
    meta: [
      { title: "Department Integrations" },
      {
        name: "description",
        content: "Source registries linked to the platform.",
      },
      { property: "og:title", content: "Department Integrations" },
      { property: "og:description", content: "Linked record sources." },
    ],
  }),
  component: Int,
});

const INIT = [
  {
    name: "Civil Registration System (birth, death)",
    owner: "Registrar General",
    on: true,
    sync: "2026-10-22 06:00",
  },
  {
    name: "Household / Family Register",
    owner: "State Planning Dept.",
    on: true,
    sync: "2026-10-22 06:00",
  },
  {
    name: "Income certificates",
    owner: "Revenue Dept. (Tehsil)",
    on: true,
    sync: "2026-10-21 22:00",
  },
  {
    name: "BPL list",
    owner: "Rural Development Dept.",
    on: true,
    sync: "2026-10-20 22:00",
  },
  {
    name: "Land records",
    owner: "Revenue Dept. (Bhulekh)",
    on: true,
    sync: "2026-10-21 22:00",
  },
  {
    name: "Benefit registries",
    owner: "Line departments",
    on: true,
    sync: "2026-10-22 02:00",
  },
  {
    name: "Identity verification (OTP)",
    owner: "Identity authority",
    on: false,
    sync: "Not connected — prototype uses demo OTP",
  },
];

function Int() {
  const [list, setList] = useState(INIT);
  const [testing, setTesting] = useState<string | null>(null);
  const test = (n: string) => {
    setTesting(n);
    setTimeout(() => {
      setTesting(null);
      const it = list.find((x) => x.name === n);
      if (it?.on) {
        toast.success(`${n}: connection healthy (demo)`);
      } else {
        toast.error(`${n}: not connected`);
      }
    }, 900);
  };
  return (
    <div>
      <PageHeader
        title="Department Integrations"
        desc="Each source remains owned by its department. The platform reads references with consent; it does not copy whole databases."
      />
      <ul className="divide-y rounded-lg border bg-card">
        {list.map((x) => (
          <li
            key={x.name}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="font-medium">{x.name}</p>
              <p className="text-xs text-muted-foreground">
                Owner: {x.owner} · Last sync: {x.sync}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Pill t={x.on ? "ok" : "neutral"}>
                {x.on ? "Connected" : "Disabled"}
              </Pill>
              <Button
                size="sm"
                variant="outline"
                onClick={() => test(x.name)}
                disabled={testing === x.name}
              >
                {testing === x.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Test connection"
                )}
              </Button>
              <Switch
                checked={x.on}
                aria-label={`Toggle ${x.name}`}
                onCheckedChange={(v) => {
                  setList(
                    list.map((y) => (y.name === x.name ? { ...y, on: v } : y)),
                  );
                  toast.success(`${x.name} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
