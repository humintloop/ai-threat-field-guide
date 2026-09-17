import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed } from "../data/model";

export function AboutPage() {
  return (
    <Reveal>
      <PageHeader eyebrow="Methodology" title="Evidence before spectacle." description="AI Threat Field Guide documents adversarial activity across the AI ecosystem and connects real events to known techniques, emerging patterns, and evidence." />
      <blockquote className="data-philosophy">“{seed.data_philosophy}”</blockquote>
      <div className="about-layout">
        <article>
          <SectionMarker>Research rules</SectionMarker>
          <div className="principle-list">{seed.methodology.principles.map((principle, index) => <div key={principle}><span>0{index + 1}</span><p>{principle}</p></div>)}</div>

          <SectionMarker>Event taxonomy</SectionMarker>
          <div className="method-grid">{seed.methodology.event_types.map((type) => <div key={type}><strong>{type}</strong><p>{type === "Research Demonstration" ? "Controlled research activity; not presented as an in-the-wild compromise." : type === "Incident" ? "Documented real-world activity or impact as represented by the source dataset." : "A supported taxonomy value retained for future records."}</p></div>)}</div>

          <SectionMarker>Mapping provenance</SectionMarker>
          <div className="method-grid">{seed.methodology.mapping_origin_values.map((origin) => <div key={origin}><strong>{origin}</strong><p>{origin === "MITRE ATLAS official" ? "Originates from the referenced ATLAS dataset snapshot." : origin === "Primary-source explicit" ? "Explicitly named by a primary source." : "A future project-authored interpretation that must remain visibly labeled."}</p></div>)}</div>
        </article>

        <aside className="dataset-panel">
          <span>Dataset status</span>
          <dl><div><dt>As of</dt><dd>{seed.as_of}</dd></div><div><dt>ATLAS version</dt><dd>{seed.atlas_snapshot.version}</dd></div><div><dt>ATLAS modified</dt><dd>{seed.atlas_snapshot.modified}</dd></div><div><dt>Project</dt><dd>Independent</dd></div></dl>
          <p>{seed.atlas_snapshot.note}</p>
          <a href={seed.atlas_snapshot.source} target="_blank" rel="noreferrer">Open ATLAS snapshot <ArrowUpRight size={16} /></a>
        </aside>
      </div>
      <section className="disclaimer"><h2>Independent research project.</h2><p>MITRE ATLAS is used as a technique-mapping framework. AI Threat Field Guide is not affiliated with MITRE or with the vendors and organizations represented in the case studies.</p></section>
    </Reveal>
  );
}
