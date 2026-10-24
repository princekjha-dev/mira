import { describe, expect, it } from "vitest";
import { evaluate, DEMO_PROFILE } from "./eligibility";
import { getScheme } from "./data";

describe("eligibility engine", () => {
  const housing = getScheme("rural-housing")!;
  it("needs verification when property records are incomplete", () => {
    expect(evaluate(housing, DEMO_PROFILE).outcome).toBe(
      "Verification Required",
    );
  });
  it("is not eligible when income exceeds ₹3,00,000 for housing", () => {
    expect(evaluate(housing, { ...DEMO_PROFILE, income: 300001 }).outcome).toBe(
      "Currently Not Eligible",
    );
  });
  it("prior household benefit never auto-rejects; it requires verification", () => {
    const r = evaluate(housing, {
      ...DEMO_PROFILE,
      puccaHouse: "no",
      priorHouseholdSchemes: ["rural-housing"],
    });
    expect(r.outcome).toBe("Verification Required");
  });
  it("old age pension requires age 60+", () => {
    expect(
      evaluate(getScheme("old-age-pension")!, { ...DEMO_PROFILE, age: 59 })
        .outcome,
    ).toBe("Currently Not Eligible");
    expect(
      evaluate(getScheme("old-age-pension")!, { ...DEMO_PROFILE, age: 60 })
        .outcome,
    ).toBe("Likely Eligible");
  });
});
