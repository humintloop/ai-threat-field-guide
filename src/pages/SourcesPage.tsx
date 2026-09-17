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
      <PageHeader eyebrow="Evidence index" title="Sources" description="Official ATLAS references and Field Guide additional sources, deduplicated and connected to the cases that reference them. No source class is inferred." aside={<div className="record-count"><strong>{sources.length}</strong><span>unique sources</span></div>} />
      <div className="filter-bar filter-bar--solo"><label className="filter-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {}, { replace: true })} placeholder="Search domains, URLs, or case IDs…" /></label></div>
      <SectionMarker>Source archive</SectionMarker>
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
