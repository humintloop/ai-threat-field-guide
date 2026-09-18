import { CanonicalAccount } from "../components/CanonicalAccount";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { trail, storyByCase } from "../data/trail";
import { KeepGoing, TrailNarrative, TrailNav } from "../components/TrailExperience";
import { PageTransition, Reveal } from "../components/Motion";
import { ExternalSource, MappingProvenance, MetadataGrid, Pill, SectionMarker, formatRecordDate } from "../components/ResearchUI";
import { canonicalPatternsForCase, caseById, seed } from "../data/model";

function eventTypeFrame(eventType: string) {
  if (eventType === "Research Demonstration") {
    return "MITRE ATLAS classifies this as a research demonstration, not an in-the-wild compromise.";
  }
  if (eventType === "Incident") {
    return "MITRE ATLAS classifies this as an incident. Read the record and cited sources for the documented scope and outcome.";
  }
  return `ATLAS files this as “${eventType}.”`;
}

function datePrecision(granularity: string) {
  const precision = granularity.toLowerCase();
  if (precision === "month") return "month known";
  if (precision === "year") return "year known";
  if (precision === "day") return "day known";
  return granularity;
}

export function CaseDetailPage() {
  const { id } = useParams();
  const record = id ? caseById.get(id) : undefined;
  if (!record) return <Navigate to="/not-found" replace />;
  const story = storyByCase.get(record.id);
  const hop = !story ? trail.find((item) => item.onward.caseId === record.id) : undefined;
  const patterns = canonicalPatternsForCase(record.id);

  return (
    <PageTransition>
      <Link className="back-link" to="/incidents"><ArrowLeft size={16} /> Back to all cases</Link>
      {story && <><Link className="trail-home-link" to="/">Who’s directing the attack?</Link><TrailNav current={record.id} /></>}
      <header className={`case-header ${story ? `story-header tone-${story.tone}` : ""}`}>
        <div className="case-header__meta">
          <Pill tone={record.event_type === "Research Demonstration" ? "research" : "neutral"}>{record.event_type}</Pill>
          <span>{record.id}</span>
          <span>{formatRecordDate(record.date, record.date_granularity)} · {datePrecision(record.date_granularity)}</span>
        </div>
        <h1>{story?.title ?? record.title}</h1>
        {story ? <p className="story-header__record">{record.title}</p> : <p>{record.summary}</p>}
      </header>

      {hop?.onward.reference && (
        <aside className="ledger-notice">
          <span className="eyebrow">Leaving the essay</span>
          <h2>This is a standard archive record.</h2>
          <p>The trail is a Field Guide comparison. This page returns to a separate MITRE ATLAS case record, with the Field Guide summary and source limits kept visible.</p>
          <p>{hop.onward.reason}</p>
          <Link to={`/incidents/${hop.caseId}`}>Back to {hop.mechanism}</Link>
        </aside>
      )}
      {!story && (record.status_note || record.observed_outcome) && (
        <p className="visible-caveat">
          <strong>{record.status_note ? "Research status" : "What was observed"}</strong>
          {record.status_note ?? record.observed_outcome}
        </p>
      )}
      {record.attribution_note && (
        <p className="visible-caveat">
          <strong>On who did this</strong>
          {record.attribution_note}
        </p>
      )}
      {story ? <TrailNarrative story={story} /> : (
        <section className="pinned-account">
          <span className="eyebrow">MITRE ATLAS record</span>
          <h2>What the ATLAS record says</h2>
          <p className="section-lede">{eventTypeFrame(record.event_type)} The text below is copied from the ATLAS case record, not rewritten by the Field Guide. Source markers link to the cited sources below.</p>
          <CanonicalAccount text={record.canonical_description} />
        </section>
      )}
      {story && <KeepGoing story={story} />}
      <details className="technical-disclosure">
        <summary>Technical details <span>Mapped techniques, recorded steps, and Field Guide patterns</span></summary>
        <details className="metadata-disclosure"><summary>Case details</summary><MetadataGrid record={record} /></details>
        {story && (
          <details className="metadata-disclosure">
            <summary>MITRE ATLAS record</summary>
            <p className="section-lede">Copied from the ATLAS case record. The Field Guide comparison appears above.</p>
            <CanonicalAccount text={record.canonical_description} />
          </details>
        )}

        <div className="case-layout">
          <article className="case-article">
            <Reveal className="prose-section">
              <SectionMarker>{record.status_note ? "Research status" : "What was observed"}</SectionMarker>
              <p className="outcome-statement">{record.observed_outcome ?? record.status_note ?? "The current dataset does not include an outcome statement."}</p>
            </Reveal>

            {record.attribution_note && (
              <Reveal className="attribution-note">
                <SectionMarker>On who did this</SectionMarker>
                <p className="section-lede">Actor names in this guide repeat source assessments. They are not independent Field Guide findings.</p>
                <p>{record.attribution_note}</p>
              </Reveal>
            )}

            <Reveal className="prose-section">
              <SectionMarker>Named methods</SectionMarker>
              <p className="section-lede">ATLAS is MITRE’s knowledge base of adversarial threats to AI systems. These are the techniques officially mapped to this case. Open one to see other mapped cases.</p>
              <div className="mapping-list">
                {record.selected_atlas_mappings.map((mapping) => (
                  <Link key={mapping.id} to={`/techniques/${encodeURIComponent(mapping.id)}`} className="mapping-row">
                    <strong>{mapping.name}</strong>
                    <span>{mapping.id}</span>
                    <div>
                      <MappingProvenance origin={record.mapping_origin} />
                      <small>{mapping.procedures.length} recorded step{mapping.procedures.length === 1 ? "" : "s"} · ATLAS {seed.atlas_snapshot.version}</small>
                    </div>
                    <ArrowRight size={18} />
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal className="prose-section">
              <SectionMarker>Recorded procedure steps</SectionMarker>
              <p className="section-lede">MITRE’s procedure steps for this case, not a Field Guide reconstruction. The smaller codes are ATLAS tactic IDs.</p>
              <div className="procedure-list">
                {record.selected_atlas_mappings.flatMap((mapping) => mapping.procedures.map((procedure) => ({ mapping, procedure }))).sort((a, b) => a.procedure.step_id.localeCompare(b.procedure.step_id)).map(({ mapping, procedure }) => (
                  <div key={`${mapping.id}-${procedure.step_id}-${procedure.description.slice(0, 24)}`} className="procedure-row">
                    <div><span>{procedure.step_id}</span><small>{procedure.tactic_id}</small></div>
                    <div><strong>{mapping.name} · {mapping.id}</strong><p>{procedure.description}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="prose-section">
              <SectionMarker>Related Field Guide patterns</SectionMarker>
              <p className="section-lede">Editorial patterns that help compare this case with others. A pattern may currently describe one case or several; it is not a MITRE label.</p>
              {patterns.length ? (
                <div className="related-grid">
                  {patterns.map((pattern) => (
                    <Link key={pattern.id} to={`/patterns/${pattern.id}`}>
                      <strong>{pattern.name}</strong><span>{pattern.id}</span><p>{pattern.description}</p><ArrowRight size={17} />
                    </Link>
                  ))}
                </div>
              ) : <p className="muted-copy">This Field Guide has not assigned an editorial pattern to this case.</p>}
              {record.patterns?.length ? <div className="tag-cluster" aria-label="Descriptive case tags">{record.patterns.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
            </Reveal>
          </article>
        </div>

        <Link className="technical-network-link" to={`/network?q=${encodeURIComponent(record.id)}`}>View this case in the relationship map <ArrowRight size={16} /></Link>
      </details>
      <section id="evidence" className="evidence-section">
        <SectionMarker>Sources</SectionMarker>
        <div className="evidence-heading">
          <h2>Sources for this case</h2>
          <p>Each link was named by the MITRE ATLAS record or added by the Field Guide. When publication details are unavailable in the dataset, the guide does not infer them.</p>
        </div>
        <div className="source-list">{record.source_records.map((source) => <ExternalSource key={source.url} url={source.url} title={source.title} origin={source.origin} />)}</div>
      </section>
    </PageTransition>
  );
}
