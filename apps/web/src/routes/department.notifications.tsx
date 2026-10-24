import { createFileRoute } from "@tanstack/react-router";
import { Bell, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/department/notifications")({
  head: () => ({
    meta: [
      { title: "System Notices & Alerts — Department" },
      {
        name: "description",
        content:
          "Department notifications, queue alerts, and statutory bulletins.",
      },
    ],
  }),
  component: DeptNotificationsPage,
});

function DeptNotificationsPage() {
  const { state } = useApp();
  const notifs = state.notifications || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Notices & Alerts"
        desc="Real-time alerts on statutory deadlines, SLA thresholds, and administrative dispatches."
        crumbs={[
          { label: "Department", to: "/department/dashboard" },
          { label: "Notifications" },
        ]}
      />

      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-0">
          <div className="divide-y divide-border text-xs">
            {notifs.map((n) => (
              <div
                key={n.id}
                className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors"
              >
                <Bell className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-sm">
                      {n.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {n.date}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
