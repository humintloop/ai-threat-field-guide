import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker, mappingOriginLabel } from "../components/ResearchUI";
import { RelationshipGraph } from "../components/RelationshipGraph";
import { graphForCases, type GraphKind } from "../data/graph";
import { cases, seed, techniques } from "../data/model";

const kinds: { id: GraphKind; label: string }[] = [{ id: "case", label: "Cases" }, { id: "pattern", label: "Recurring" }, { id: "technique", label: "Techniques" }];

export function NetworkPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const visibleKinds = new Set<GraphKind>((params.get("types")?.split(",").filter(Boolean) as GraphKind[]) ?? kinds.map((kind) => kind.id));
  const fullGraph = useMemo(() => graphForCases(), []);
  const filteredGraph = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    let nodes = fullGraph.nodes.filter((node) => visibleKinds.has(node.kind));
    if (normalized) {
      const matches = new Set(nodes.filter((node) => `${node.id} ${node.label}`.toLowerCase().includes(normalized)).map((node) => node.id));
      const connected = new Set(fullGraph.edges.flatMap((edge) => matches.has(edge.source) || matches.has(edge.target) ? [edge.source, edge.target] : []));
      nodes = nodes.filter((node) => matches.has(node.id) || connected.has(node.id));
    }
    const ids = new Set(nodes.map((node) => node.id));
    return { nodes, edges: fullGraph.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target)) };
  }, [fullGraph, query, visibleKinds]);
  const filteredNodeById = useMemo(
    () => new Map(filteredGraph.nodes.map((node) => [node.id, node])),
    [filteredGraph.nodes],
  );

  const toggleKind = (kind: GraphKind) => {
    const nextKinds = new Set(visibleKinds);
    if (nextKinds.has(kind) && nextKinds.size > 1) nextKinds.delete(kind); else nextKinds.add(kind);
    const next = new URLSearchParams(params);
    if (nextKinds.size === kinds.length) next.delete("types"); else next.set("types", [...nextKinds].join(","));
    setParams(next, { replace: true });
  };

  const setQuery = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value); else next.delete("q");
    setParams(next, { replace: true });
  };

  return (
    <Reveal>
      <PageHeader eyebrow="How they connect" title="The connection map" description="Cases, recurring shapes, and ATLAS methods — linked only where this dataset says they are. Hover a node to isolate a thread. Click to open the record. Recurring shapes are Field Guide readings, not MITRE labels." aside={<div className="record-count"><strong>{filteredGraph.nodes.length}</strong><span>items shown</span></div>} />
      <div className="network-controls">
        <label className="filter-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a case, recurring shape, or method…" /></label>
        <div className="kind-toggles">{kinds.map((kind) => <button key={kind.id} type="button" className={visibleKinds.has(kind.id) ? "is-active" : ""} onClick={() => toggleKind(kind.id)} aria-pressed={visibleKinds.has(kind.id)}>{kind.label}</button>)}</div>
      </div>
      <div className="network-canvas"><RelationshipGraph data={filteredGraph} ariaLabel="Map of cases, recurring shapes, and ATLAS methods in this dataset" /></div>
      <section className="network-list">
        <SectionMarker>The same connections, as a list</SectionMarker>
        {filteredGraph.edges.map((edge) => {
          const source = filteredNodeById.get(edge.source);
          const target = filteredNodeById.get(edge.target);
          if (!source || !target) return null;
          const kindLabel = (kind: string) => kind === "pattern" ? "recurring" : kind === "technique" ? "method" : kind;
          return (
            <div key={edge.id}>
              <Link to={source.href}><span>{kindLabel(source.kind)}</span><strong>{source.label}</strong></Link>
              <ArrowRight size={17} aria-hidden="true" />
              <Link to={target.href}><span>{kindLabel(target.kind)}</span><strong>{target.label}</strong></Link>
              <span>{edge.provenance ? mappingOriginLabel(edge.provenance) : "Field Guide shape · not an ATLAS link"}</span>
            </div>
          );
        })}
        {!filteredGraph.edges.length && <div className="empty-state"><strong>Nothing connects in this view.</strong><p>Turn another type back on, or broaden the search.</p></div>}
        <p className="network-list__summary">This set: {cases.length} cases, {seed.patterns.length} Field Guide shapes, {techniques.length} ATLAS methods.</p>
      </section>
    </Reveal>
  );
}
