import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { graphForCases } from "../data/graph";
import { cases, metrics, seed, sources } from "../data/model";
import { AnimatedRule, Reveal } from "../components/Motion";
import { ArchiveRow, Pill, SectionMarker } from "../components/ResearchUI";
import { RelationshipGraph } from "../components/RelationshipGraph";

const latestIncidents = cases.filter((record) => record.event_type === "Incident").slice(0, 6);
const research = cases.filter((record) => record.event_type === "Research Demonstration");
const homepageGraph = graphForCases(seed.patterns.flatMap((pattern) => pattern.related_cases).slice(0, 6));

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

        <Reveal className="featured-case" delay={0.08}>
          <SectionMarker>Featured case</SectionMarker>
          <div className="featured-case__link">
            <div className="featured-case__copy">
              <Pill>{latestIncidents[0].event_type}</Pill>
              <h2>{latestIncidents[0].title}</h2>
              <p>{latestIncidents[0].summary}</p>
              <span className="featured-case__meta">{latestIncidents[0].id} · {latestIncidents[0].date}</span>
            </div>
            <RelationshipGraph data={graphForCases([latestIncidents[0].id])} className="featured-case__visual" />
            <Link to={`/incidents/${latestIncidents[0].id}`} className="featured-case__open">Open case <ArrowRight size={18} /></Link>
          </div>
        </Reveal>
      </section>

      <AnimatedRule />

      <section className="metric-band" aria-label="Current intelligence overview">
        {[
          [metrics.incidents, "Incidents"],
          [metrics.research, "Research demonstration"],
          [metrics.techniques, "Represented techniques"],
          [metrics.patterns, "Emerging patterns"],
          [metrics.sources, "Unique sources"],
          [metrics.agentic, "Agentic cases"],
        ].map(([value, label], index) => (
          <Reveal key={String(label)} delay={index * 0.04} className="metric">
            <strong>{value}</strong><span>{label}</span>
          </Reveal>
        ))}
      </section>

      <section className="home-section">
        <SectionMarker action={<Link to="/patterns">View all</Link>}>Emerging patterns</SectionMarker>
        <div className="pattern-grid">
          {seed.patterns.slice(0, 6).map((pattern, index) => (
            <Reveal key={pattern.id} delay={Math.min(index, 4) * 0.05}>
              <Link className="pattern-tile" to={`/patterns/${pattern.id}`}>
                <span>{pattern.id}</span>
                <h3>{pattern.name}</h3>
                <p>{pattern.description}</p>
                <div><b>{pattern.related_cases.length}</b> related case{pattern.related_cases.length === 1 ? "" : "s"}<ArrowRight size={18} /></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="home-columns home-section">
        <div>
          <SectionMarker action={<Link to="/incidents">View all</Link>}>Recently documented</SectionMarker>
          <div className="archive-list">
            {latestIncidents.map((record) => <ArchiveRow key={record.id} record={record} compact />)}
          </div>
        </div>
        <aside>
          <SectionMarker>Evidence index</SectionMarker>
          <div className="source-summary">
            {sources.slice(0, 7).map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                <span>{source.hostname}</span><small>{source.caseIds.length} case{source.caseIds.length === 1 ? "" : "s"}</small><ArrowUpRight size={15} />
              </a>
            ))}
            <Link to="/sources">Browse all evidence <ArrowRight size={16} /></Link>
          </div>
        </aside>
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
