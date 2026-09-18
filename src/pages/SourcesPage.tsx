import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { ExternalSource, PageHeader, SectionMarker } from "../components/ResearchUI";
import { caseById, sources } from "../data/model";

export function SourcesPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const results = useMemo(() => sources.filter((source) => `${source.hostname} ${source.title} ${source.url} ${source.caseIds.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Reveal>
      <PageHeader eyebrow="Sources and provenance" title="Cited sources" description="Every document cited by this guide, listed once with the cases that reference it. Sources include links named by MITRE ATLAS and additional Field Guide references; they are not all primary reports." aside={<div className="record-count"><strong>{sources.length}</strong><span>sources cited</span></div>} />
      <div className="filter-bar filter-bar--solo"><label className="filter-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} placeholder="Search a site, title, or case ID…" /></label></div>
      <SectionMarker>Cited documents</SectionMarker>
      <div className="source-list source-list--index">
        {results.map((source) => (
          <div key={source.url} className="source-index-item">
            <ExternalSource url={source.url} title={source.title} origin={source.origins.join(" + ")} />
            <div className="source-index-item__cases">{source.caseIds.map((id) => <span key={id}>{id} · {caseById.get(id)?.title}</span>)}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
