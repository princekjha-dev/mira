import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, PageHeader } from "@/components/gov/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Citizen" },
      {
        name: "description",
        content: "Updates about your applications and records.",
      },
      { property: "og:title", content: "Notifications" },
      {
        property: "og:description",
        content: "Your application and record updates.",
      },
    ],
  }),
  component: Notifs,
});

function Notifs() {
  const { state, set } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("all");
  const list = state.notifications.filter(
    (n) => tab === "all" || (tab === "unread" ? !n.read : n.read),
  );
  const mark = (id: string, read: boolean) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read } : n,
      ),
    }));
  return (
    <div>
      <PageHeader
        title="Notifications"
        actions={
          <Button
            variant="outline"
            onClick={() => {
              set((s) => ({
                notifications: s.notifications.map((n) => ({
                  ...n,
                  read: true,
                })),
              }));
              toast.success("All marked as read");
            }}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Mark all as read
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({state.notifications.filter((n) => !n.read).length})
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>
      {list.length === 0 ? (
        <Empty
          title="You're all caught up"
          body="No notifications in this view."
        />
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {list.map((n) => (
            <li
              key={n.id}
              className={cn("flex gap-3 p-4", !n.read && "bg-secondary/40")}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  n.read ? "bg-transparent" : "bg-gov",
                )}
                aria-label={n.read ? "Read" : "Unread"}
              />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm", !n.read && "font-semibold")}>
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {fmtDate(n.date)}
                </p>
                <div className="mt-2 flex gap-2">
                  {n.link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        mark(n.id, true);
                        nav({ to: n.link as "/" });
                      }}
                    >
                      Open
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => mark(n.id, !n.read)}
                  >
                    Mark as {n.read ? "unread" : "read"}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
