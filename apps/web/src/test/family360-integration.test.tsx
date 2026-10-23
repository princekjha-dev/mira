import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { ROLE_CONFIGS, getRoleConfig } from "@/lib/role-config";

describe("Family360 & Master Product Architecture", () => {
  it("resolves all Family360 and connected routes in TanStack router", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    const routes = [
      "/citizen/family",
      "/verifier/family360",
      "/officer/family360",
      "/auditor/family360",
      "/schemes",
      "/verifier/queue",
      "/officer/schemes",
      "/auditor/audit",
    ];

    for (const path of routes) {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    }
  });

  it("enforces coherent Information Architecture with Schemes and Family360 across roles", () => {
    // 1. Citizen role navigation
    const citizenNav = ROLE_CONFIGS.citizen.navItems;
    const citizenHrefs = citizenNav.map((n) => n.to);
    expect(citizenHrefs).toContain("/schemes");
    expect(citizenHrefs).toContain("/citizen/family");
    expect(citizenHrefs).toContain("/citizen/documents");

    // 2. Verifier role navigation
    const verifierNav = ROLE_CONFIGS.verifier.navItems;
    const verifierHrefs = verifierNav.map((n) => n.to);
    expect(verifierHrefs).toContain("/verifier/family360");
    expect(verifierHrefs).toContain("/verifier/queue");

    // 3. Officer role navigation
    const officerNav = ROLE_CONFIGS.officer.navItems;
    const officerHrefs = officerNav.map((n) => n.to);
    expect(officerHrefs).toContain("/officer/family360");
    expect(officerHrefs).toContain("/schemes");

    // 4. Auditor role navigation
    const auditorNav = ROLE_CONFIGS.auditor.navItems;
    const auditorHrefs = auditorNav.map((n) => n.to);
    expect(auditorHrefs).toContain("/auditor/family360");
    expect(auditorHrefs).toContain("/auditor/audit");
  });

  it("computes verified multi-generational BFS relationship path correctly", () => {
    // Verify BFS logic connecting Grandparent -> Parent -> Child
    const relationships = [
      { from: "Devraj Sharma", to: "Ramakant Sharma", rel: "PARENT" },
      { from: "Ramakant Sharma", to: "Rajesh Sharma", rel: "PARENT" },
      { from: "Rajesh Sharma", to: "Aarav Sharma", rel: "PARENT" },
      { from: "Rajesh Sharma", to: "Sunita Sharma", rel: "SPOUSE" },
    ];

    const adj = new Map<string, Array<{ to: string; rel: string }>>();
    relationships.forEach((r) => {
      if (!adj.has(r.from)) adj.set(r.from, []);
      if (!adj.has(r.to)) adj.set(r.to, []);
      adj.get(r.from)!.push({ to: r.to, rel: r.rel });
      adj.get(r.to)!.push({ to: r.from, rel: `Related (${r.rel})` });
    });

    const start = "Devraj Sharma";
    const target = "Aarav Sharma";

    const queue: Array<{ curr: string; path: string[] }> = [
      { curr: start, path: [start] },
    ];
    const visited = new Set<string>([start]);
    let foundPath: string[] | null = null;

    while (queue.length > 0) {
      const { curr, path } = queue.shift()!;
      if (curr === target) {
        foundPath = path;
        break;
      }
      for (const n of adj.get(curr) || []) {
        if (!visited.has(n.to)) {
          visited.add(n.to);
          queue.push({ curr: n.to, path: [...path, n.to] });
        }
      }
    }

    expect(foundPath).not.toBeNull();
    expect(foundPath).toEqual([
      "Devraj Sharma",
      "Ramakant Sharma",
      "Rajesh Sharma",
      "Aarav Sharma",
    ]);
  });
});
