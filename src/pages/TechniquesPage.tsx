import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed, techniques } from "../data/model";

export function TechniquesPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => techniques.filter((technique) => `${technique.id} ${technique.name}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Reveal>
      <PageHeader eyebrow={`MITRE ATLAS ${seed.atlas_snapshot.version}`} title="Represented techniques" description="Only techniques explicitly represented by the current case dataset appear here. The Field Guide remains event-first." aside={<div className="record-count"><strong>{techniques.length}</strong><span>unique techniques</span></div>} />
      <div className="filter-bar filter-bar--solo"><label className="filter-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search technique ID or name…" /></label></div>
      <SectionMarker>Technique index</SectionMarker>
      <div className="technique-index">
        {results.map((technique) => (
          <Link key={technique.id} to={`/techniques/${encodeURIComponent(technique.id)}`}>
            <span>{technique.id}</span><strong>{technique.name}</strong><small>{technique.caseIds.length} related case{technique.caseIds.length === 1 ? "" : "s"}</small><ArrowRight size={18} />
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
