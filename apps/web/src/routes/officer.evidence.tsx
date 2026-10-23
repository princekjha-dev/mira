import { createFileRoute } from "@tanstack/react-router";
import { FilesExplorer } from "@/components/gov/FilesExplorer";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence & Document Vault — Officer Workspace" },
      { name: "description", content: "Versioned document repository, citizen uploads, and geotagged field evidence." },
    ],
  }),
  component: OfficerEvidencePage,
});

function OfficerEvidencePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence & Document Vault"
        desc="Immutable document repository, field inspection geotagged photographs, and version histories."
        crumbs={[{ label: "Officer", to: "/officer/dashboard" }, { label: "Evidence Vault" }]}
      />
      <FilesExplorer />
    </div>
  );
}
