import { createFileRoute } from "@tanstack/react-router";
import { FilesExplorer } from "@/components/gov/FilesExplorer";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/verifier/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Vault — Verifier Workstation" },
      {
        name: "description",
        content:
          "Versioned inspection media, document uploads, and biometric audit tokens.",
      },
    ],
  }),
  component: VerifierEvidencePage,
});

function VerifierEvidencePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Evidence Vault"
        desc="Authoritative document store, version diffing, and cryptographic file checksum records."
        crumbs={[
          { label: "Verifier", to: "/verifier/dashboard" },
          { label: "Evidence Vault" },
        ]}
      />
      <FilesExplorer />
    </div>
  );
}
