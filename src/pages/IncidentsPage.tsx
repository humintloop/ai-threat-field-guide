import { Funnel, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { ArchiveRow, PageHeader } from "../components/ResearchUI";
import { cases, seed } from "../data/model";

export function IncidentsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const type = params.get("type") ?? "All";
  const agentic = params.get("agentic") ?? "All";
  const sort = params.get("sort") ?? "newest";

  const update = (key: string, value: string, fallback = "All") => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    const filtered = cases.filter((record) => {
      const text = [record.title, record.summary, record.actor, record.target, record.swarm_classification, ...(record.patterns ?? []), ...record.selected_atlas_mappings.flatMap((mapping) => [mapping.id, mapping.name])].filter(Boolean).join(" ").toLowerCase();
      return (!normalized || text.includes(normalized))
        && (type === "All" || record.event_type === type)
        && (agentic === "All" || (agentic === "Agentic" ? Boolean(record.swarm_classification) : !record.swarm_classification));
    });
    return filtered.sort((a, b) => sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }, [query, type, agentic, sort]);

  return (
    <Reveal>
      <PageHeader eyebrow="The archive" title="Every case in this guide" description="Real-world incidents and research demonstrations, kept distinct. Open a case for MITRE’s pinned account. The trail on the home page is a separate Field Guide reading, not an official ATLAS relationship." aside={<div className="record-count"><strong>{results.length}</strong><span>cases shown</span></div>} />
      <div className="filter-bar">
        <label className="filter-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => update("q", event.target.value, "")} placeholder="Search titles, actors, targets, methods…" /></label>
        <label><Funnel size={15} /><span className="sr-only">Event type</span><select value={type} onChange={(event) => update("type", event.target.value)}><option>All</option>{seed.methodology.event_types.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Whether the case uses AI agents</span><select value={agentic} onChange={(event) => update("agentic", event.target.value)}><option>All</option><option value="Agentic">Uses AI agents</option><option value="Not classified">Not labeled that way</option></select></label>
        <label><span className="sr-only">Sort order</span><select value={sort} onChange={(event) => update("sort", event.target.value, "newest")}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
      </div>
      <div className="archive-list archive-list--large">
        {results.map((record) => <ArchiveRow key={record.id} record={record} />)}
        {!results.length && <div className="empty-state"><strong>No cases match this view.</strong><p>Clear a filter or try a broader word.</p></div>}
      </div>
    </Reveal>
  );
}
