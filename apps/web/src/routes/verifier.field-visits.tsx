import { createFileRoute } from "@tanstack/react-router";
import { OfficerFieldVisitsPage } from "./officer.field-visits";

export const Route = createFileRoute("/verifier/field-visits")({
  head: () => ({
    meta: [
      { title: "Field Work — Verification Officer" },
      { name: "description", content: "Review assigned household field visits and submit verification evidence." },
    ],
  }),
  component: OfficerFieldVisitsPage,
});
