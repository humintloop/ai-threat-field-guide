import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Motion";
import { PageHeader, SectionMarker } from "../components/ResearchUI";
import { seed } from "../data/model";

export function PatternsPage() {
  return (
    <Reveal>
      <PageHeader eyebrow="Cross-case analysis" title="Emerging patterns" description="Recurring behavioral and operational concepts observed across one or more cases. These are project taxonomy, not official standards." />
      <SectionMarker>Pattern index</SectionMarker>
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
