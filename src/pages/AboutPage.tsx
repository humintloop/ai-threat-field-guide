import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed } from "../data/model";

function eventTypeCopy(type: string) {
  if (type === "Incident") {
    return "A case MITRE ATLAS classifies as an incident. Read the case record and cited sources for the documented scope, impact, and uncertainty.";
  }
  if (type === "Research Demonstration") {
    const example = seed.research_demonstrations[0];
    if (!example) return "A researcher showed a working path. This snapshot has no demonstrations yet.";
    const shortName = example.title.split(":")[0];
    const atlasClass = example.canonical_case_type
      ? ` MITRE classifies it as ${/^[aeiou]/i.test(example.canonical_case_type) ? "an" : "a"} ${example.canonical_case_type}.`
      : "";
    const wild = /no evidence it was exploited in the wild/i.test(example.status_note ?? "")
      ? " There is no evidence it was exploited in the wild."
      : "";
    return `A researcher showed a working path. This snapshot’s example is ${shortName}, targeting ${example.target}.${atlasClass}${wild}`;
  }
  return "An ATLAS case type not represented in this snapshot.";
}

function mappingOriginCopy(origin: string) {
  if (origin === "MITRE ATLAS official") {
    return `The case-to-technique relationship comes from the saved ATLAS ${seed.atlas_snapshot.version} snapshot.`;
  }
  if (origin === "Primary-source explicit") {
    return "A source explicitly names the technique. This snapshot does not currently present these relationships as official ATLAS mappings.";
  }
  return "A Field Guide interpretation, labeled as editorial rather than presented as an ATLAS relationship.";
}

export function AboutPage() {
  return (
    <Reveal>
      <PageHeader
        eyebrow="About the Field Guide"
        title="How records are labeled."
        description={`This guide uses MITRE ATLAS ${seed.atlas_snapshot.version} for canonical case metadata, technique IDs, and official relationships. Case summaries, trails, and patterns are Field Guide editorial and are labeled accordingly. Failed outcomes remain visible.`}
      />
      <blockquote className="data-philosophy">“{seed.data_philosophy}”</blockquote>
      <div className="about-layout">
        <article>
          <SectionMarker>Working rules</SectionMarker>
          <div className="principle-list">{seed.methodology.principles.map((principle, index) => <div key={principle}><span>0{index + 1}</span><p>{principle}</p></div>)}</div>

          <SectionMarker>Case classification</SectionMarker>
          <div className="method-grid">{seed.methodology.event_types.map((type) => <div key={type}><strong>{type}</strong><p>{eventTypeCopy(type)}</p></div>)}</div>

          <SectionMarker>Technique relationship provenance</SectionMarker>
          <div className="method-grid">{seed.methodology.mapping_origin_values.map((origin) => <div key={origin}><strong>{origin}</strong><p>{mappingOriginCopy(origin)}</p></div>)}</div>
        </article>

        <aside className="dataset-panel">
          <span>Pinned ATLAS snapshot</span>
          <dl>
            <div><dt>As of</dt><dd>{seed.as_of}</dd></div>
            <div><dt>ATLAS version</dt><dd>{seed.atlas_snapshot.version}</dd></div>
            <div><dt>Snapshot date</dt><dd>{seed.atlas_snapshot.modified}</dd></div>
            <div><dt>Affiliation</dt><dd>Independent</dd></div>
          </dl>
          <p>{seed.atlas_snapshot.note}</p>
          <a href={seed.atlas_snapshot.source} target="_blank" rel="noreferrer">Open the ATLAS {seed.atlas_snapshot.version} YAML <ArrowUpRight size={16} /></a>
        </aside>
      </div>
      <section className="disclaimer">
        <h2>Aaron maintains this guide.</h2>
        <p>MITRE ATLAS {seed.atlas_snapshot.version} is the canonical source for case metadata, techniques, and official relationships. The Field Guide is not a MITRE product, and it is not affiliated with the vendors or governments named in the records.</p>
      </section>
    </Reveal>
  );
}
