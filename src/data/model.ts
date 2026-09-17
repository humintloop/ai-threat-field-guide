import { z } from "zod";
import seedJson from "../../data/generated/field-guide.json";

const eventTypeSchema = z.enum([
  "Incident",
  "Research Demonstration",
  "Proof of Concept",
  "Reported / Unverified",
]);

const mappingOriginSchema = z.enum([
  "MITRE ATLAS official",
  "Primary-source explicit",
  "Analyst mapping",
]);

const atlasMappingSchema = z.object({
  id: z.string().regex(/^AML\.T\d{4}(\.\d{3})?$/),
  name: z.string().min(1),
  description: z.string().min(1),
  atlas_created: z.string().min(1),
  atlas_modified: z.string().min(1),
  procedures: z.array(z.object({
    step_id: z.string().min(1),
    tactic_id: z.string().min(1),
    description: z.string().min(1),
    leads_to: z.array(z.string()),
  })).min(1),
});

const provenanceSchema = z.object({
  origin: z.string().min(1),
  source_id: z.string().min(1).optional(),
  source_value: z.string().min(1).optional(),
  source_urls: z.array(z.string().url()).optional(),
}).nullable();

const sourceRecordSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  origin: z.string().min(1),
  source_type: z.string().nullable(),
});

const baseCaseSchema = z.object({
  id: z.string().min(1),
  atlas_case_id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  date_granularity: z.string().min(1),
  atlas_record_created: z.string().min(1),
  atlas_record_modified: z.string().min(1),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  event_type: eventTypeSchema,
  canonical_case_type: z.string().min(1),
  actor: z.string().min(1).optional(),
  target: z.string().min(1),
  reporter: z.string().min(1).optional(),
  canonical_description: z.string().min(1),
  summary: z.string().min(1),
  observed_outcome: z.string().min(1).optional(),
  status_note: z.string().min(1).optional(),
  selected_atlas_mappings: z.array(atlasMappingSchema).min(1),
  patterns: z.array(z.string().min(1)).optional(),
  swarm_classification: z.string().min(1).nullable().optional(),
  mapping_origin: mappingOriginSchema.optional(),
  sources: z.array(z.string().url()).min(1),
  source_records: z.array(sourceRecordSchema).min(1),
  attribution_note: z.string().min(1).optional(),
  featured: z.boolean(),
  field_provenance: z.object({
    title: provenanceSchema,
    event_type: provenanceSchema,
    actor: provenanceSchema,
    target: provenanceSchema,
    date: provenanceSchema,
    summary: provenanceSchema,
    observed_outcome: provenanceSchema,
    status_note: provenanceSchema,
    attribution_note: provenanceSchema,
    agentic_classification: provenanceSchema,
  }),
});

const patternSchema = z.object({
  id: z.string().regex(/^PAT-\d{3}$/),
  name: z.string().min(1),
  description: z.string().min(1),
  related_cases: z.array(z.string().min(1)),
  primary_atlas_technique: z.string().regex(/^AML\.T\d{4}(\.\d{3})?$/),
});

const seedSchema = z.object({
  project: z.string().min(1),
  as_of: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_philosophy: z.string().min(1),
  atlas_snapshot: z.object({
    version: z.string().min(1),
    source: z.string().url(),
    modified: z.string().min(1),
    note: z.string().min(1),
  }),
  methodology: z.object({
    event_types: z.array(eventTypeSchema),
    mapping_origin_values: z.array(mappingOriginSchema),
    principles: z.array(z.string().min(1)),
  }),
  incidents: z.array(baseCaseSchema),
  research_demonstrations: z.array(baseCaseSchema),
  patterns: z.array(patternSchema),
});

export type EventType = z.infer<typeof eventTypeSchema>;
export type MappingOrigin = z.infer<typeof mappingOriginSchema>;
export type AtlasMapping = z.infer<typeof atlasMappingSchema>;
export type CaseRecord = z.infer<typeof baseCaseSchema>;
export type PatternRecord = z.infer<typeof patternSchema>;

function validateReferences(parsed: z.infer<typeof seedSchema>) {
  const caseIds = parsed.incidents
    .concat(parsed.research_demonstrations)
    .map((record) => record.id);
  const caseIdSet = new Set(caseIds);
  const patternIds = parsed.patterns.map((pattern) => pattern.id);

  const duplicates = [...caseIds, ...patternIds].filter(
    (id, index, values) => values.indexOf(id) !== index,
  );
  if (duplicates.length) {
    throw new Error(`Duplicate dataset IDs: ${[...new Set(duplicates)].join(", ")}`);
  }

  const invalidReferences = parsed.patterns.flatMap((pattern) =>
    pattern.related_cases
      .filter((caseId) => !caseIdSet.has(caseId))
      .map((caseId) => `${pattern.id} → ${caseId}`),
  );
  if (invalidReferences.length) {
    throw new Error(`Invalid pattern references: ${invalidReferences.join(", ")}`);
  }
}

export const seed = seedSchema.parse(seedJson);
validateReferences(seed);

export const cases: CaseRecord[] = [
  ...seed.incidents,
  ...seed.research_demonstrations,
].sort((a, b) => b.date.localeCompare(a.date));

export const caseById = new Map(cases.map((record) => [record.id, record]));
export const patternById = new Map(seed.patterns.map((pattern) => [pattern.id, pattern]));

export type TechniqueRecord = AtlasMapping & {
  caseIds: string[];
  patternIds: string[];
};

const techniqueMap = new Map<string, TechniqueRecord>();
for (const record of cases) {
  for (const mapping of record.selected_atlas_mappings) {
    const technique = techniqueMap.get(mapping.id) ?? {
      ...mapping,
      caseIds: [],
      patternIds: [],
    };
    technique.caseIds.push(record.id);
    techniqueMap.set(mapping.id, technique);
  }
}
for (const pattern of seed.patterns) {
  const technique = techniqueMap.get(pattern.primary_atlas_technique);
  if (technique) technique.patternIds.push(pattern.id);
}

export const techniques = [...techniqueMap.values()].sort((a, b) =>
  a.id.localeCompare(b.id),
);
export const techniqueById = new Map(techniques.map((technique) => [technique.id, technique]));

export type SourceRecord = {
  url: string;
  hostname: string;
  title: string;
  origins: string[];
  caseIds: string[];
};

const sourceMap = new Map<string, SourceRecord>();
for (const record of cases) {
  for (const sourceRecord of record.source_records) {
    const { url } = sourceRecord;
    const source = sourceMap.get(url) ?? {
      url,
      hostname: new URL(url).hostname.replace(/^www\./, ""),
      title: sourceRecord.title,
      origins: [],
      caseIds: [],
    };
    source.caseIds.push(record.id);
    if (!source.origins.includes(sourceRecord.origin)) source.origins.push(sourceRecord.origin);
    sourceMap.set(url, source);
  }
}

export const sources = [...sourceMap.values()].sort((a, b) =>
  a.hostname.localeCompare(b.hostname),
);

export function canonicalPatternsForCase(caseId: string) {
  return seed.patterns.filter((pattern) => pattern.related_cases.includes(caseId));
}

export function casesForPattern(pattern: PatternRecord) {
  return pattern.related_cases.flatMap((id) => {
    const record = caseById.get(id);
    return record ? [record] : [];
  });
}

export function displayDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function yearMonth(date: string) {
  return date.slice(0, 7);
}

export const metrics = {
  incidents: seed.incidents.length,
  research: seed.research_demonstrations.length,
  techniques: techniques.length,
  patterns: seed.patterns.length,
  sources: sources.length,
  agentic: cases.filter((record) => Boolean(record.swarm_classification)).length,
};

export type SearchResult = {
  id: string;
  kind: "Case" | "Pattern" | "Technique" | "Source";
  title: string;
  meta: string;
  href: string;
  score: number;
};

function searchScore(query: string, values: string[], exactValues: string[] = []) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 0;
  if (exactValues.some((value) => value.toLowerCase() === normalized)) return 100;
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const haystack = values.join(" ").toLowerCase();
  if (tokens.every((token) => haystack.split(/\W+/).some((word) => word.startsWith(token)))) return 60;
  if (tokens.every((token) => haystack.includes(token))) return 35;
  return 0;
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];
  for (const record of cases) {
    const canonical = canonicalPatternsForCase(record.id).map((pattern) => pattern.name);
    const values = [
      record.id,
      record.title,
      record.summary,
      record.actor ?? "",
      record.target,
      record.swarm_classification ?? "",
      ...(record.patterns ?? []),
      ...canonical,
      ...record.selected_atlas_mappings.flatMap((mapping) => [mapping.id, mapping.name]),
      ...record.sources,
    ];
    const score = searchScore(query, values, [record.id, record.title]);
    if (score) results.push({ id: record.id, kind: "Case", title: record.title, meta: record.event_type, href: `/incidents/${record.id}`, score });
  }
  for (const pattern of seed.patterns) {
    const score = searchScore(query, [pattern.id, pattern.name, pattern.description, pattern.primary_atlas_technique], [pattern.id, pattern.name]);
    if (score) results.push({ id: pattern.id, kind: "Pattern", title: pattern.name, meta: `${pattern.related_cases.length} related case${pattern.related_cases.length === 1 ? "" : "s"}`, href: `/patterns/${pattern.id}`, score });
  }
  for (const technique of techniques) {
    const score = searchScore(query, [technique.id, technique.name], [technique.id, technique.name]);
    if (score) results.push({ id: technique.id, kind: "Technique", title: technique.name, meta: technique.id, href: `/techniques/${encodeURIComponent(technique.id)}`, score });
  }
  for (const source of sources) {
    const score = searchScore(query, [source.hostname, source.url], [source.hostname, source.url]);
    if (score) results.push({ id: source.url, kind: "Source", title: source.hostname, meta: `${source.caseIds.length} referenced case${source.caseIds.length === 1 ? "" : "s"}`, href: `/sources?q=${encodeURIComponent(source.hostname)}`, score });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 12);
}
