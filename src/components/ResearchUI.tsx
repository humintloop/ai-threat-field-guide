import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { CaseRecord, MappingOrigin } from "../data/model";
import { canonicalPatternsForCase, displayDate, yearMonth } from "../data/model";

export function PageHeader({ eyebrow, title, description, aside }: { eyebrow: string; title: string; description: string; aside?: React.ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {aside && <div className="page-header__aside">{aside}</div>}
    </header>
  );
}

export function SectionMarker({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="section-marker">
      <span><i aria-hidden="true" />{children}</span>
      {action}
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "research" | "accent" | "official" }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

export function MappingProvenance({ origin }: { origin?: MappingOrigin }) {
  return <Pill tone={origin === "MITRE ATLAS official" ? "official" : "neutral"}>{origin ?? "Provenance not specified"}</Pill>;
}

export function ArchiveRow({ record, compact = false }: { record: CaseRecord; compact?: boolean }) {
  const patterns = canonicalPatternsForCase(record.id);
  return (
    <Link className={`archive-row ${compact ? "archive-row--compact" : ""}`} to={`/incidents/${record.id}`}>
      <div className="archive-row__date">{yearMonth(record.date)}</div>
      <div className="archive-row__body">
        <div className="archive-row__title">{record.title}</div>
        {!compact && <p>{record.summary}</p>}
        <div className="archive-row__meta">
          <Pill tone={record.event_type === "Research Demonstration" ? "research" : "neutral"}>{record.event_type}</Pill>
          {patterns.slice(0, 2).map((pattern) => <span key={pattern.id}>{pattern.name}</span>)}
          {record.swarm_classification && <span>{record.swarm_classification}</span>}
        </div>
      </div>
      <ArrowRight className="archive-row__arrow" size={21} aria-hidden="true" />
    </Link>
  );
}

export function ExternalSource({ url, title, origin, caseTitle }: { url: string; title?: string; origin?: string; caseTitle?: string }) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return (
    <a className="source-row" href={url} target="_blank" rel="noreferrer">
      <div>
        <span className="source-row__label">{origin ?? "SOURCE"} / UNCLASSIFIED</span>
        <strong>{title ?? host}</strong>
        <span className="source-row__host">{host}</span>
        {caseTitle && <span className="source-row__case">Referenced by {caseTitle}</span>}
      </div>
      <span className="source-row__open">Open source <ArrowUpRight size={16} aria-hidden="true" /></span>
    </a>
  );
}

export function MetadataGrid({ record }: { record: CaseRecord }) {
  const items = [
    ["Case ID", record.id, "Field Guide"],
    ["Event date", `${displayDate(record.date)} · ${record.date_granularity} precision`, "MITRE ATLAS"],
    ["Event type", `${record.event_type} · ATLAS: ${record.canonical_case_type}`, "MITRE ATLAS"],
    ["ATLAS case", record.atlas_case_id, "MITRE ATLAS"],
    ["Actor", record.actor, "MITRE ATLAS"],
    ["Target", record.target, "MITRE ATLAS"],
    ["Reporter", record.reporter, "MITRE ATLAS"],
    ["Agentic class", record.swarm_classification ?? undefined, record.swarm_classification ? "Field Guide analyst" : undefined],
    ["Last verified", displayDate(record.last_verified), "Field Guide"],
  ].filter((item): item is [string, string, string] => Boolean(item[1]));

  return (
    <dl className="metadata-grid">
      {items.map(([label, value, provenance]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
          <small>{provenance}</small>
        </div>
      ))}
    </dl>
  );
}
