import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { OfficerAppTable } from "@/components/gov/OfficerAppTable";

function OfficerVerificationPage() {
  const { state } = useApp();
  const q = state.applications.filter((a) =>
    [
      "Verification Required",
      "Documents Under Review",
      "Officer Review",
      "Submitted",
      "Additional Evidence Required",
    ].includes(a.status),
  );
  return (
    <div>
      <PageHeader
        title="Verification Queue"
        desc="Flagged items need your review. Nothing in this queue has been rejected automatically."
      />
      <OfficerAppTable apps={q} />
    </div>
  );
}

export const Route = createFileRoute("/officer/verification")({
  head: () => ({
    meta: [
      { title: "Verification Queue — Officer" },
      {
        name: "description",
        content: "Applications that need record or document verification.",
      },
      { property: "og:title", content: "Verification Queue" },
      {
        property: "og:description",
        content: "Applications needing verification.",
      },
    ],
  }),
  component: OfficerVerificationPage,
});
