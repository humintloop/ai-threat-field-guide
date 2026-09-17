import { describe, expect, it } from "vitest";
import {
  caseById,
  cases,
  metrics,
  searchAll,
  seed,
  techniqueById,
} from "./model";

describe("normalized Field Guide data", () => {
  it("keeps incidents and research demonstrations distinct", () => {
    expect(seed.incidents).toHaveLength(11);
    expect(seed.research_demonstrations).toHaveLength(1);
    expect(metrics.incidents).toBe(11);
    expect(metrics.research).toBe(1);
    expect(seed.research_demonstrations[0].event_type).toBe("Research Demonstration");
  });

  it("identifies the pinned canonical snapshot", () => {
    expect(seed.atlas_snapshot.version).toBe("2026.09");
    expect(seed.atlas_snapshot.source).toMatch(/mitre-atlas\/atlas-data/);
  });

  it("uses the canonical LAMEHUG date and precision", () => {
    const record = cases.find((candidate) => candidate.title.includes("LAMEHUG"));
    expect(record?.date).toBe("2025-06-03");
    expect(record?.date_granularity).toBe("Month");
  });

  it("only exposes verified official relationships", () => {
    for (const record of cases) {
      expect(record.mapping_origin).toBe("MITRE ATLAS official");
      for (const mapping of record.selected_atlas_mappings) {
        expect(mapping.procedures.length).toBeGreaterThan(0);
        expect(techniqueById.has(mapping.id)).toBe(true);
      }
    }
  });

  it("resolves every editorial pattern relationship", () => {
    for (const pattern of seed.patterns) {
      expect(techniqueById.has(pattern.primary_atlas_technique)).toBe(true);
      for (const caseId of pattern.related_cases) expect(caseById.has(caseId)).toBe(true);
    }
  });
});

describe("global search ranking", () => {
  it("ranks an exact case ID first", () => {
    const result = searchAll("ATFG-0011");
    expect(result[0]).toMatchObject({ id: "ATFG-0011", score: 100 });
  });

  it("finds technique IDs and source hostnames", () => {
    expect(searchAll("AML.T0051").some((result) => result.kind === "Technique")).toBe(true);
    expect(searchAll("mitre.org").some((result) => result.kind === "Source")).toBe(true);
  });
});
