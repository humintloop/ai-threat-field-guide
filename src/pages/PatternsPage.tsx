import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed } from "../data/model";

export function PatternsPage() {
  const grouped = seed.patterns.filter((pattern) => pattern.related_cases.length > 1);
  const groupingNote = grouped.length === 1
    ? `${grouped[0].name} is the only label that currently groups more than one case.`
    : grouped.length > 1
      ? `${grouped.length} of these labels currently group more than one case.`
      : "Each label currently names a shape documented in a single case.";

  return (
    <Reveal>
      <PageHeader
        eyebrow="Field Guide labels · not MITRE"
        title={`${seed.patterns.length} named shapes`}
        description={`Editors named shapes that show up in these records — a poisoned agent tool, malware that queries a model at runtime, an AI API used as a command channel. ${groupingNote} Each row still points to an ATLAS method ID.`}
        aside={<div className="record-count"><strong>{seed.patterns.length}</strong><span>Field Guide labels</span></div>}
      />
      <SectionMarker>The {seed.patterns.length} shapes</SectionMarker>
      <div className="pattern-index">
        {seed.patterns.map((pattern) => (
          <Link key={pattern.id} to={`/patterns/${pattern.id}`}>
            <span className="pattern-index__id">{pattern.id}</span>
            <div><h2>{pattern.name}</h2><p>{pattern.description}</p></div>
            <div className="pattern-index__meta"><span>{pattern.related_cases.length} case{pattern.related_cases.length === 1 ? "" : "s"}</span><span>{pattern.primary_atlas_technique}</span></div>
            <ArrowRight size={20} />
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
