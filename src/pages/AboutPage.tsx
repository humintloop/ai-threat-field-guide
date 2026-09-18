import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed } from "../data/model";

function eventTypeCopy(type: string) {
  if (type === "Incident") {
    return "Documented activity with real-world impact, as the pinned ATLAS record describes it — production systems, users, or confirmed effects.";
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
  return "A label ATLAS supports. This snapshot has no records of this type yet.";
}

function mappingOriginCopy(origin: string) {
  if (origin === "MITRE ATLAS official") {
    return `The case-to-technique link comes from the pinned ATLAS ${seed.atlas_snapshot.version} snapshot.`;
  }
  if (origin === "Primary-source explicit") {
    return "A primary report names this technique — a vendor write-up, CERT advisory, or the organization’s own disclosure.";
  }
  return "A Field Guide interpretation. If we add one, it stays labeled as ours.";
}

export function AboutPage() {
  return (
    <Reveal>
      <PageHeader
        eyebrow="About the Field Guide"
        title="How records are labeled."
        description={`This snapshot pins MITRE ATLAS ${seed.atlas_snapshot.version} for case facts, technique IDs, and official relationships. Trails, recurring names, and reading notes are Field Guide editorial. If an attempt did not get in, the record says so.`}
      />
      <blockquote className="data-philosophy">“{seed.data_philosophy}”</blockquote>
      <div className="about-layout">
        <article>
          <SectionMarker>Working rules</SectionMarker>
          <div className="principle-list">{seed.methodology.principles.map((principle, index) => <div key={principle}><span>0{index + 1}</span><p>{principle}</p></div>)}</div>

          <SectionMarker>Incident, demonstration, or something else</SectionMarker>
          <div className="method-grid">{seed.methodology.event_types.map((type) => <div key={type}><strong>{type}</strong><p>{eventTypeCopy(type)}</p></div>)}</div>

          <SectionMarker>Where a technique link comes from</SectionMarker>
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
