import { canonicalPatternsForCase, cases, seed, techniques } from "./model";

export type GraphKind = "case" | "pattern" | "technique";

export type GraphNode = {
  id: string;
  label: string;
  kind: GraphKind;
  href: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  provenance?: string;
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export function graphForCases(caseIds?: string[]): GraphData {
  const selectedCases = caseIds ? cases.filter((record) => caseIds.includes(record.id)) : cases;
  const selectedCaseIds = new Set(selectedCases.map((record) => record.id));
  const selectedPatterns = seed.patterns.filter((pattern) =>
    pattern.related_cases.some((id) => selectedCaseIds.has(id)),
  );
  const techniqueIds = new Set<string>();
  selectedCases.forEach((record) => record.selected_atlas_mappings.forEach((mapping) => techniqueIds.add(mapping.id)));
  selectedPatterns.forEach((pattern) => techniqueIds.add(pattern.primary_atlas_technique));
  const selectedTechniques = techniques.filter((technique) => techniqueIds.has(technique.id));

  const nodes: GraphNode[] = [
    ...selectedCases.map((record) => ({ id: record.id, label: record.title, kind: "case" as const, href: `/incidents/${record.id}` })),
    ...selectedPatterns.map((pattern) => ({ id: pattern.id, label: pattern.name, kind: "pattern" as const, href: `/patterns/${pattern.id}` })),
    ...selectedTechniques.map((technique) => ({ id: technique.id, label: `${technique.id}\n${technique.name}`, kind: "technique" as const, href: `/techniques/${encodeURIComponent(technique.id)}` })),
  ];

  const edges: GraphEdge[] = [];
  for (const record of selectedCases) {
    for (const mapping of record.selected_atlas_mappings) {
      edges.push({
        id: `${record.id}--${mapping.id}`,
        source: record.id,
        target: mapping.id,
        provenance: record.mapping_origin,
      });
    }
    for (const pattern of canonicalPatternsForCase(record.id)) {
      edges.push({ id: `${record.id}--${pattern.id}`, source: record.id, target: pattern.id });
    }
  }
  for (const pattern of selectedPatterns) {
    edges.push({
      id: `${pattern.id}--${pattern.primary_atlas_technique}`,
      source: pattern.id,
      target: pattern.primary_atlas_technique,
    });
  }

  return { nodes, edges };
}
