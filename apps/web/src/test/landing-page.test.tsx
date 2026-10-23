import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

describe("Landing page redesign", () => {
  it("resolves route / correctly", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const matches = router.matchRoutes("/");
    expect(matches.length).toBeGreaterThan(0);
    const lastMatch = matches.at(-1);
    expect(lastMatch?.routeId).toBe("/");
  });

  it("resolves all primary navigation routes connected from the landing page", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const routesToTest = [
      "/schemes",
      "/eligibility",
      "/track",
      "/help",
      "/login",
      "/citizen/family",
      "/citizen/documents",
      "/citizen/benefits",
      "/citizen/applications",
    ];

    for (const path of routesToTest) {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe("__root__");
    }
  });
});
