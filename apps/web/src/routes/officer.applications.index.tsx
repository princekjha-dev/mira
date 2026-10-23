import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { OfficerAppTable } from "@/components/gov/OfficerAppTable";

export const Route = createFileRoute("/officer/applications/")({
  head: () => ({ meta: [{ title: "Applications — Officer" }, { name: "description", content: "All applications assigned to your office." }, { property: "og:title", content: "Applications" }, { property: "og:description", content: "Officer application list." }] }),
  component: () => {
    const { state } = useApp();
    return <div><PageHeader title="Applications" desc="All submitted applications for your jurisdiction." /><OfficerAppTable apps={state.applications.filter((a) => a.status !== "Draft")} /></div>;
  },
});
