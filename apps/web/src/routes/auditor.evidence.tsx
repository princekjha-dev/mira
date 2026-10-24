import { createFileRoute } from "@tanstack/react-router";
import { FilesExplorer } from "@/components/gov/FilesExplorer";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/auditor/evidence")({
  head: () => ({
    meta: [
      { title: "Forensic Evidence Vault — Auditor" },
      {
        name: "description",
        content:
          "Inspection of uploaded documents, version histories, and forensic file tokens.",
      },
    ],
  }),
  component: AuditorEvidencePage,
});

function AuditorEvidencePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Forensic Evidence & Document Vault"
        desc="Read-only forensic inspection of uploaded affidavits, land deeds, income certificates, and version trees."
        crumbs={[
          { label: "Auditor", to: "/auditor/dashboard" },
          { label: "Evidence Vault" },
        ]}
      />
      <FilesExplorer />
    </div>
  );
}
