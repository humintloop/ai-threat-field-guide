import { ArrowRight, ArrowUpRight, CaretDown } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { graphForCases } from "../data/graph";
import { canonicalPatternsForCase, cases, metrics, seed, sources } from "../data/model";
import { AnimatedRule, Reveal } from "../components/Motion";
import { ArchiveRow, Pill, SectionMarker } from "../components/ResearchUI";
import { RelationshipGraph } from "../components/RelationshipGraph";

const latestIncidents = cases.filter((record) => record.event_type === "Incident").slice(0, 6);
const research = cases.filter((record) => record.event_type === "Research Demonstration");
const homepageGraph = graphForCases(seed.patterns.flatMap((pattern) => pattern.related_cases).slice(0, 6));
const featuredCase = latestIncidents[0];
const featuredSource = featuredCase.source_records[0];
const featuredPatterns = canonicalPatternsForCase(featuredCase.id);

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <Reveal className="home-hero__intro">
          <span className="eyebrow">Independent adversarial AI research</span>
          <h1>Tracing threats<br />through the AI<br />ecosystem.</h1>
          <p>A living, evidence-based repository connecting real-world AI security events, research, attack techniques, and emerging agentic behavior.</p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/incidents">Explore incidents <ArrowRight size={18} /></Link>
            <Link className="button" to="/network">Open network <ArrowRight size={18} /></Link>
          </div>
        </Reveal>

        <Reveal className="featured-evidence" delay={0.08}>
          <div className="featured-evidence__bar">
            <span><i /> Source excerpt</span>
            <span>{featuredSource.origin}</span>
          </div>
          <a className="source-excerpt" href={featuredSource.url} target="_blank" rel="noreferrer" aria-label={`Open source: ${featuredSource.title}`}>
            <div className="source-excerpt__publisher">
              <strong>OpenAI</strong>
              <span>Security</span>
            </div>
            <h2>{featuredSource.title}</h2>
            <div className="source-excerpt__footer">
              <span>Primary source record</span>
              <span>View original <ArrowUpRight size={16} /></span>
            </div>
          </a>
          <div className="featured-evidence__case">
            <div>
              <span className="featured-case__meta">{featuredCase.event_type} · {featuredCase.id} · {featuredCase.date}</span>
              <h3>{featuredCase.title}</h3>
            </div>
            <Link to={`/incidents/${featuredCase.id}`} className="featured-evidence__action">Open case <ArrowRight size={18} /></Link>
          </div>
        </Reveal>
      </section>

      <AnimatedRule />

      <Reveal className="evidence-trace-wrap">
        <details className="evidence-trace">
          <summary>
            <span className="evidence-trace__label"><i /> Relationship summary</span>
            <strong>{featuredPatterns.length} patterns · {featuredCase.selected_atlas_mappings.length} ATLAS techniques</strong>
            <span className="evidence-trace__hint">View verified links <CaretDown size={16} /></span>
          </summary>
          <div className="evidence-trace__body">
            <div className="trace-column">
              <span>Case</span>
              <Link to={`/incidents/${featuredCase.id}`}><b>{featuredCase.id}</b>{featuredCase.title}<ArrowRight size={16} /></Link>
            </div>
            <div className="trace-column">
              <span>Field Guide patterns</span>
              {featuredPatterns.map((pattern) => (
                <Link key={pattern.id} to={`/patterns/${pattern.id}`}><b>{pattern.id}</b>{pattern.name}<ArrowRight size={16} /></Link>
              ))}
            </div>
            <div className="trace-column">
              <span>MITRE ATLAS techniques</span>
              {featuredCase.selected_atlas_mappings.slice(0, 6).map((technique) => (
                <Link key={technique.id} to={`/techniques/${technique.id}`}><b>{technique.id}</b>{technique.name}<ArrowRight size={16} /></Link>
              ))}
              {featuredCase.selected_atlas_mappings.length > 6 && (
                <Link className="trace-column__more" to={`/incidents/${featuredCase.id}`}>
                  <b>+{featuredCase.selected_atlas_mappings.length - 6}</b>View all techniques in the case record<ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </details>
      </Reveal>

      <section className="home-columns home-section home-section--archive">
        <div>
          <SectionMarker action={<Link to="/incidents">View all</Link>}>Recently documented</SectionMarker>
          <div className="archive-list home-archive">
            {latestIncidents.slice(0, 3).map((record, index) => <ArchiveRow key={record.id} record={record} compact={index !== 0} />)}
          </div>
        </div>
        <aside className="provenance-ledger">
          <SectionMarker>Dataset at a glance</SectionMarker>
          <div className="provenance-ledger__counts" aria-label="Current intelligence overview">
            {[
              [metrics.incidents, "Incidents"],
              [metrics.patterns, "Patterns"],
              [metrics.techniques, "Techniques"],
              [metrics.sources, "Sources"],
            ].map(([value, label]) => (
              <div key={String(label)}><strong>{value}</strong><span>{label}</span></div>
            ))}
          </div>
          <p>Counts reflect the pinned dataset as of <strong>{seed.as_of}</strong>. Research demonstrations remain separate from documented incidents.</p>
          <Link className="provenance-ledger__link" to="/about">Read methodology <ArrowRight size={16} /></Link>
        </aside>
      </section>

      <section className="home-section pattern-ledger">
        <SectionMarker action={<Link to="/patterns">View all</Link>}>Emerging patterns</SectionMarker>
        <div className="pattern-ledger__grid">
          {seed.patterns.slice(0, 3).map((pattern, index) => (
            <Reveal key={pattern.id} delay={index * 0.04}>
              <Link className="pattern-ledger__item" to={`/patterns/${pattern.id}`}>
                <span>{pattern.id}</span>
                <h3>{pattern.name}</h3>
                {index === 0 && <p>{pattern.description}</p>}
                <div><b>{pattern.related_cases.length}</b> related case{pattern.related_cases.length === 1 ? "" : "s"}<ArrowRight size={18} /></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-section evidence-index-preview">
        <SectionMarker action={<Link to="/sources">Browse all evidence</Link>}>Evidence index</SectionMarker>
        <div className="source-summary source-summary--quiet">
          {sources.slice(0, 4).map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
              <span>{source.hostname}</span><small>{source.caseIds.length} case{source.caseIds.length === 1 ? "" : "s"}</small><ArrowUpRight size={15} />
            </a>
          ))}
        </div>
      </section>

      <section className="home-section network-feature">
        <SectionMarker action={<Link to="/network">Open investigation surface</Link>}>Relationship network</SectionMarker>
        <div className="network-feature__header">
          <h2>Follow the thread from event to pattern to technique.</h2>
          <p>This view contains only relationships verified against the pinned ATLAS release and explicit Field Guide pattern links. Select a node to open its record.</p>
        </div>
        <RelationshipGraph data={homepageGraph} />
        <div className="graph-fallback">
          {seed.patterns.slice(0, 4).map((pattern) => (
            <Link key={pattern.id} to={`/patterns/${pattern.id}`}><span>{pattern.id}</span>{pattern.name}<ArrowRight size={16} /></Link>
          ))}
        </div>
      </section>

      {research.length > 0 && (
        <section className="home-section research-section">
          <SectionMarker>Research demonstrations</SectionMarker>
          <div className="research-heading">
            <div><Pill tone="research">Research demonstration</Pill><h2>Demonstrated, not observed in the wild.</h2></div>
            <p>Research activity is intentionally separated from documented incidents.</p>
          </div>
          {research.map((record) => <ArchiveRow key={record.id} record={record} />)}
        </section>
      )}
    </>
  );
}
