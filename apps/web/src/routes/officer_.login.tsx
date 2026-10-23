import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "./login";

export const Route = createFileRoute("/officer_/login")({
  head: () => ({
    meta: [
      { title: "Officer access — Mira" },
      {
        name: "description",
        content:
          "Authorized government officer demo sign-in for application review and document verification.",
      },
      { property: "og:title", content: "Officer access — Mira" },
      {
        property: "og:description",
        content:
          "Government officer access to verification, applications and citizen services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LoginPage initialRole="officer" />,
});
