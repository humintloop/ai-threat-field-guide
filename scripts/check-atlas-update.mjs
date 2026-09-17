#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectPath = path.join(root, "data/editorial/project.json");
const summaryPath = path.join(root, "atlas-update-summary.md");
const manifestUrl = "https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/manifest.yaml";
const distributionRoot = "https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist";
const apply = process.argv.includes("--apply");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "ai-threat-field-guide-update-check" } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  return response.text();
}

function objectDiff(previous = {}, next = {}) {
  const previousIds = new Set(Object.keys(previous));
  const nextIds = new Set(Object.keys(next));
  const added = [...nextIds].filter((id) => !previousIds.has(id)).sort();
  const removed = [...previousIds].filter((id) => !nextIds.has(id)).sort();
  const updated = [...nextIds].filter((id) => previousIds.has(id) && JSON.stringify(previous[id]) !== JSON.stringify(next[id])).sort();
  return { added, removed, updated };
}

function relationshipDiff(previous = {}, next = {}) {
  return objectDiff(previous, next);
}

function nameFor(collection, id) {
  return collection?.[id]?.name ?? id;
}

function diffSection(label, diff, currentCollection, nextCollection) {
  const lines = [`## ${label}`, ""];
  lines.push(`- Added: ${diff.added.length}`);
  lines.push(`- Updated: ${diff.updated.length}`);
  lines.push(`- Removed: ${diff.removed.length}`);
  if (diff.added.length) lines.push("", "### Added", ...diff.added.map((id) => `- \`${id}\` — ${nameFor(nextCollection, id)}`));
  if (diff.updated.length) lines.push("", "### Updated", ...diff.updated.map((id) => `- \`${id}\` — ${nameFor(nextCollection, id)}`));
  if (diff.removed.length) lines.push("", "### Removed", ...diff.removed.map((id) => `- \`${id}\` — ${nameFor(currentCollection, id)}`));
  return lines.join("\n");
}

const project = readJson(projectPath);
const currentPath = path.join(root, `data/upstream/atlas/ATLAS-${project.atlas_version}.yaml`);
if (!fs.existsSync(currentPath)) throw new Error(`Pinned ATLAS file missing: ${currentPath}`);
const currentText = fs.readFileSync(currentPath, "utf8");
const current = YAML.parse(currentText);
const manifest = YAML.parse(await fetchText(manifestUrl));
const latestEntry = manifest[0];
const compatibleDistribution = latestEntry.versions.find((item) => item["format-version"] === current["format-version"]);

if (!compatibleDistribution) {
  const message = `ATLAS ${latestEntry.release} is available, but it does not provide the pinned format ${current["format-version"]}. Manual schema migration is required.`;
  fs.writeFileSync(summaryPath, `# MITRE ATLAS update requires manual review\n\n${message}\n`);
  throw new Error(message);
}

if (String(latestEntry.release) === String(current.collection.version)) {
  console.log(`MITRE ATLAS ${current.collection.version} is current.`);
  process.exit(0);
}

const latestUrl = `${distributionRoot}/${compatibleDistribution.path}`;
const latestText = await fetchText(latestUrl);
const latest = YAML.parse(latestText);

if (latest["format-version"] !== current["format-version"]) throw new Error("Downloaded ATLAS format does not match the selected compatible distribution");
if (String(latest.collection.version) !== String(latestEntry.release)) throw new Error("Manifest release does not match downloaded collection.version");
for (const key of ["collection", "matrix", "tactics", "techniques", "mitigations", "case-studies", "relationships"]) {
  if (!latest[key]) throw new Error(`Downloaded ATLAS release is missing top-level key: ${key}`);
}

const techniqueDiff = objectDiff(current.techniques, latest.techniques);
const mitigationDiff = objectDiff(current.mitigations, latest.mitigations);
const caseDiff = objectDiff(current["case-studies"], latest["case-studies"]);
const relationships = relationshipDiff(current.relationships, latest.relationships);

const summary = [
  `# Update MITRE ATLAS ${current.collection.version} → ${latest.collection.version}`,
  "",
  `- Release date: ${latestEntry["release-date"]}`,
  `- Format version: ${latest["format-version"]}`,
  `- Upstream file: ${latestUrl}`,
  "",
  "> This update is proposed for human review. Editorial Field Guide files are not overwritten.",
  "",
  diffSection("Techniques", techniqueDiff, current.techniques, latest.techniques),
  "",
  diffSection("Mitigations", mitigationDiff, current.mitigations, latest.mitigations),
  "",
  diffSection("Case studies", caseDiff, current["case-studies"], latest["case-studies"]),
  "",
  `## Relationship groups\n\n- Added: ${relationships.added.length}\n- Updated: ${relationships.updated.length}\n- Removed: ${relationships.removed.length}`,
  "",
  "## Review checklist",
  "",
  "- [ ] Review renamed or removed objects.",
  "- [ ] Review changes to cases with editorial overlays.",
  "- [ ] Confirm all official Field Guide mappings still validate.",
  "- [ ] Confirm generated record counts and UI snapshots.",
  "",
].join("\n");

fs.writeFileSync(summaryPath, summary);
console.log(summary);

if (apply) {
  const nextPath = path.join(root, `data/upstream/atlas/ATLAS-${latest.collection.version}.yaml`);
  fs.writeFileSync(nextPath, latestText);
  project.atlas_version = String(latest.collection.version);
  fs.writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);
  console.log(`Pinned ATLAS ${latest.collection.version}. Run npm run build:data and the test suite before review.`);
}
