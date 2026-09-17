import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageTransition, Reveal } from "../components/Motion";
import { ExternalSource, MappingProvenance, MetadataGrid, Pill, SectionMarker } from "../components/ResearchUI";
import { RelationshipGraph } from "../components/RelationshipGraph";
import { graphForCases } from "../data/graph";
import { canonicalPatternsForCase, caseById, seed } from "../data/model";

export function CaseDetailPage() {
  const { id } = useParams();
  const record = id ? caseById.get(id) : undefined;
  if (!record) return <Navigate to="/not-found" replace />;
  const patterns = canonicalPatternsForCase(record.id);
  const graph = graphForCases([record.id]);

  return (
    <PageTransition>
      <Link className="back-link" to="/incidents"><ArrowLeft size={16} /> Back to case archive</Link>
      <header className="case-header">
        <div className="case-header__meta"><Pill tone={record.event_type === "Research Demonstration" ? "research" : "neutral"}>{record.event_type}</Pill><span>{record.id}</span><span>{record.date} / {record.date_granularity}</span></div>
        <h1>{record.title}</h1>
        <p>{record.summary}</p>
      </header>

      <MetadataGrid record={record} />

      <div className="case-layout">
        <article className="case-article">
          <Reveal className="prose-section">
            <SectionMarker>{record.status_note ? "Research status" : "Observed outcome"}</SectionMarker>
            <p className="outcome-statement">{record.observed_outcome ?? record.status_note ?? "No outcome statement is provided in the current dataset."}</p>
          </Reveal>

          {record.attribution_note && (
            <Reveal className="attribution-note">
              <SectionMarker>Attribution note</SectionMarker>
              <p>{record.attribution_note}</p>
            </Reveal>
          )}

          <Reveal className="prose-section">
            <SectionMarker>MITRE ATLAS mappings</SectionMarker>
            <div className="mapping-list">
              {record.selected_atlas_mappings.map((mapping) => (
                <Link key={mapping.id} to={`/techniques/${encodeURIComponent(mapping.id)}`} className="mapping-row">
                  <span>{mapping.id}</span>
                  <strong>{mapping.name}</strong>
                  <div><MappingProvenance origin={record.mapping_origin} /><small>{mapping.procedures.length} procedure step{mapping.procedures.length === 1 ? "" : "s"} · ATLAS {seed.atlas_snapshot.version}</small></div>
                  <ArrowRight size={18} />
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal className="prose-section">
            <SectionMarker>Official procedure path</SectionMarker>
            <div className="procedure-list">
              {record.selected_atlas_mappings.flatMap((mapping) => mapping.procedures.map((procedure) => ({ mapping, procedure }))).sort((a, b) => a.procedure.step_id.localeCompare(b.procedure.step_id)).map(({ mapping, procedure }) => (
                <div key={`${mapping.id}-${procedure.step_id}-${procedure.description.slice(0, 24)}`} className="procedure-row">
                  <div><span>{procedure.step_id}</span><small>{procedure.tactic_id}</small></div>
                  <div><strong>{mapping.id} · {mapping.name}</strong><p>{procedure.description}</p></div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="prose-section">
            <SectionMarker>Related patterns</SectionMarker>
            {patterns.length ? (
              <div className="related-grid">
                {patterns.map((pattern) => (
                  <Link key={pattern.id} to={`/patterns/${pattern.id}`}>
                    <span>{pattern.id}</span><strong>{pattern.name}</strong><p>{pattern.description}</p><ArrowRight size={17} />
                  </Link>
                ))}
              </div>
            ) : <p className="muted-copy">No canonical pattern relationship is declared for this case.</p>}
            {record.patterns?.length ? <div className="tag-cluster" aria-label="Descriptive case tags">{record.patterns.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
          </Reveal>
        </article>

        <aside className="case-aside">
          <SectionMarker>Case network</SectionMarker>
          <RelationshipGraph data={graph} className="relationship-graph--detail" />
          <div className="graph-fallback graph-fallback--detail">
            {patterns.map((pattern) => <Link key={pattern.id} to={`/patterns/${pattern.id}`}><span>Pattern</span>{pattern.name}<ArrowRight size={15} /></Link>)}
            {record.selected_atlas_mappings.map((mapping) => <Link key={mapping.id} to={`/techniques/${encodeURIComponent(mapping.id)}`}><span>Technique</span>{mapping.id} · {mapping.name}<ArrowRight size={15} /></Link>)}
          </div>
        </aside>
      </div>

      <section className="evidence-section">
        <SectionMarker>Evidence & sources</SectionMarker>
        <div className="evidence-heading"><h2>Trace the record.</h2><p>Each link below is declared by the pinned ATLAS record or the attributed Field Guide overlay. Source type and publication date remain unclassified when not supplied.</p></div>
        <div className="source-list">{record.source_records.map((source) => <ExternalSource key={source.url} url={source.url} title={source.title} origin={source.origin} />)}</div>
      </section>
    </PageTransition>
  );
}
