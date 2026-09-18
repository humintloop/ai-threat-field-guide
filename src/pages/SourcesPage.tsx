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
      <PageHeader eyebrow="The receipts" title="Original reports" description="Every document this guide cites. MITRE’s ATLAS links and extra Field Guide sources, listed once, with the cases that point to them. If we don’t know a source type, we don’t invent one." aside={<div className="record-count"><strong>{sources.length}</strong><span>documents cited</span></div>} />
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
