#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectPath = path.join(root, "data/editorial/project.json");
const patternsPath = path.join(root, "data/editorial/patterns.json");
const casesDirectory = path.join(root, "data/editorial/cases");
const outputPath = path.join(root, "data/generated/field-guide.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  throw new Error(`[field-guide data] ${message}`);
}

function ensureString(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`Missing ${label}`);
  return value;
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

const project = readJson(projectPath);
const atlasPath = path.join(root, `data/upstream/atlas/ATLAS-${project.atlas_version}.yaml`);
if (!fs.existsSync(atlasPath)) fail(`Pinned ATLAS file is missing: ${path.relative(root, atlasPath)}`);
const atlas = YAML.parse(fs.readFileSync(atlasPath, "utf8"));
const patternFile = readJson(patternsPath);
const overlays = fs.readdirSync(casesDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => readJson(path.join(casesDirectory, name)));

if (atlas.collection.version !== project.atlas_version) {
  fail(`Pinned ATLAS version ${atlas.collection.version} does not match editorial configuration ${project.atlas_version}`);
}

const fieldGuideIds = new Set();
const overlayCaseIds = new Set();
for (const overlay of overlays) {
  ensureString(overlay.case_id, "editorial case_id");
  ensureString(overlay.field_guide_id, `${overlay.case_id} field_guide_id`);
  ensureString(overlay.last_verified, `${overlay.case_id} last_verified`);
  if (overlayCaseIds.has(overlay.case_id)) fail(`Duplicate editorial case ${overlay.case_id}`);
  if (fieldGuideIds.has(overlay.field_guide_id)) fail(`Duplicate field guide ID ${overlay.field_guide_id}`);
  overlayCaseIds.add(overlay.case_id);
  fieldGuideIds.add(overlay.field_guide_id);
  if (!atlas["case-studies"]?.[overlay.case_id]) fail(`Editorial case ${overlay.case_id} does not exist in ATLAS ${atlas.collection.version}`);
}

const caseIdToFieldGuideId = new Map(overlays.map((overlay) => [overlay.case_id, overlay.field_guide_id]));

function normalizeEventType(type) {
  if (type === "Exercise") return "Research Demonstration";
  if (type === "Incident") return "Incident";
  return "Reported / Unverified";
}

function editorialValue(claim) {
  return claim && typeof claim.value === "string" ? claim.value : undefined;
}

function sourceRecords(canonical, overlay) {
  const official = (canonical.references ?? []).map((reference) => ({
    title: reference.title,
    url: reference.url,
    origin: "MITRE ATLAS reference",
    source_type: null,
  }));
  const additional = (overlay.additional_sources ?? []).map((url) => ({
    title: new URL(url).hostname.replace(/^www\./, ""),
    url,
    origin: "Field Guide additional source",
    source_type: null,
  }));
  return uniqueBy([...official, ...additional], "url");
}

function officialMappings(caseId) {
  const relationships = atlas.relationships?.[caseId]?.employs ?? [];
  const grouped = new Map();
  for (const relationship of relationships) {
    if (relationship.source !== caseId) fail(`Relationship source mismatch: expected ${caseId}, received ${relationship.source}`);
    if (relationship["relationship-type"] !== "employs") fail(`Unsupported relationship type for ${caseId} → ${relationship.target}`);
    const technique = atlas.techniques?.[relationship.target];
    if (!technique) fail(`Official relationship ${caseId} → ${relationship.target} references a missing technique`);
    const mapping = grouped.get(relationship.target) ?? {
      id: relationship.target,
      name: technique.name,
      description: technique.description,
      atlas_created: technique["created-date"],
      atlas_modified: technique["modified-date"],
      procedures: [],
    };
    mapping.procedures.push({
      step_id: relationship["step-id"],
      tactic_id: relationship.tactic,
      description: relationship.description,
      leads_to: relationship["leads-to"] ?? [],
    });
    grouped.set(relationship.target, mapping);
  }
  return [...grouped.values()].sort((a, b) => a.id.localeCompare(b.id));
}

const normalizedCases = overlays.map((overlay) => {
  const canonical = atlas["case-studies"][overlay.case_id];
  const source_records = sourceRecords(canonical, overlay);
  const mappings = officialMappings(overlay.case_id);
  if (!mappings.length) fail(`${overlay.case_id} has no official ATLAS relationships`);

  return {
    id: overlay.field_guide_id,
    atlas_case_id: overlay.case_id,
    title: canonical.name,
    date: canonical.date,
    date_granularity: canonical["date-granularity"],
    atlas_record_created: canonical["created-date"],
    atlas_record_modified: canonical["modified-date"],
    last_verified: overlay.last_verified,
    event_type: normalizeEventType(canonical.type),
    canonical_case_type: canonical.type,
    actor: canonical.actor,
    target: canonical.target,
    reporter: canonical.reporter,
    canonical_description: canonical.description,
    summary: editorialValue(overlay.summary),
    observed_outcome: editorialValue(overlay.observed_outcome),
    status_note: editorialValue(overlay.status_note),
    attribution_note: editorialValue(overlay.attribution_note),
    topics: overlay.topics ?? [],
    patterns: overlay.topics ?? [],
    swarm_classification: overlay.agentic_classification?.value ?? null,
    mapping_origin: "MITRE ATLAS official",
    selected_atlas_mappings: mappings,
    source_records,
    sources: source_records.map((source) => source.url),
    featured: Boolean(overlay.featured),
    field_provenance: {
      title: { origin: "MITRE ATLAS", source_id: overlay.case_id },
      event_type: { origin: "MITRE ATLAS", source_id: overlay.case_id, source_value: canonical.type },
      actor: { origin: "MITRE ATLAS", source_id: overlay.case_id },
      target: { origin: "MITRE ATLAS", source_id: overlay.case_id },
      date: { origin: "MITRE ATLAS", source_id: overlay.case_id },
      summary: overlay.summary?.provenance ?? null,
      observed_outcome: overlay.observed_outcome?.provenance ?? null,
      status_note: overlay.status_note?.provenance ?? null,
      attribution_note: overlay.attribution_note?.provenance ?? null,
      agentic_classification: overlay.agentic_classification?.provenance ?? null,
    },
  };
});

for (const pattern of patternFile.patterns) {
  ensureString(pattern.id, "pattern id");
  const technique = atlas.techniques?.[pattern.primary_atlas_technique];
  if (!technique) fail(`${pattern.id} references missing technique ${pattern.primary_atlas_technique}`);
  for (const caseId of pattern.related_cases) {
    if (!overlayCaseIds.has(caseId)) fail(`${pattern.id} references case ${caseId} without an editorial overlay`);
  }
  const hasOfficialAnchor = pattern.related_cases.some((caseId) =>
    (atlas.relationships?.[caseId]?.employs ?? []).some((relationship) => relationship.target === pattern.primary_atlas_technique),
  );
  if (!hasOfficialAnchor) fail(`${pattern.id} primary anchor ${pattern.primary_atlas_technique} is not an official relationship for any related case`);
}

const patterns = patternFile.patterns.map((pattern) => ({
  ...pattern,
  related_cases: pattern.related_cases.map((caseId) => caseIdToFieldGuideId.get(caseId)),
  provenance: { origin: "field-guide-analyst" },
}));

const output = {
  project: project.project,
  as_of: project.as_of,
  data_philosophy: project.data_philosophy,
  atlas_snapshot: {
    version: atlas.collection.version,
    source: `https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/v6/ATLAS-${atlas.collection.version}.yaml`,
    modified: atlas.collection["modified-date"],
    note: "Canonical ATLAS case metadata and relationships are extracted from the pinned upstream release during the build.",
  },
  methodology: {
    event_types: project.event_types,
    mapping_origin_values: project.mapping_origin_values,
    principles: project.principles,
  },
  incidents: normalizedCases.filter((record) => record.event_type === "Incident"),
  research_demonstrations: normalizedCases.filter((record) => record.event_type === "Research Demonstration"),
  patterns,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

const relationshipCount = normalizedCases.reduce((total, record) => total + record.selected_atlas_mappings.reduce((count, mapping) => count + mapping.procedures.length, 0), 0);
console.log(`Generated ${path.relative(root, outputPath)} from ATLAS ${atlas.collection.version}: ${normalizedCases.length} cases, ${relationshipCount} verified relationships, ${patterns.length} editorial patterns.`);
