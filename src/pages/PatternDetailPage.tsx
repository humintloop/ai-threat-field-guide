import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageTransition } from "../components/Motion";
import { ArchiveRow, PageHeader, Pill, SectionMarker } from "../components/ResearchUI";
import { casesForPattern, patternById, techniqueById } from "../data/model";

export function PatternDetailPage() {
  const { id } = useParams();
  const pattern = id ? patternById.get(id) : undefined;
  if (!pattern) return <Navigate to="/not-found" replace />;
  const relatedCases = casesForPattern(pattern);
  const technique = techniqueById.get(pattern.primary_atlas_technique);

  return (
    <PageTransition>
      <Link className="back-link" to="/patterns"><ArrowLeft size={16} /> Back to patterns</Link>
      <PageHeader eyebrow={`${pattern.id} / Project taxonomy`} title={pattern.name} description={pattern.description} aside={<div className="record-count"><strong>{relatedCases.length}</strong><span>related cases</span></div>} />
      <div className="pattern-detail-summary">
        <div><span>Primary ATLAS anchor</span><Link to={`/techniques/${encodeURIComponent(pattern.primary_atlas_technique)}`}><Pill tone="official">{pattern.primary_atlas_technique}</Pill><strong>{technique?.name ?? pattern.primary_atlas_technique}</strong><ArrowRight size={17} /></Link></div>
        <div><span>Classification</span><strong>Emerging cross-case pattern</strong><small>Not an official framework technique</small></div>
      </div>
      <SectionMarker>Related cases</SectionMarker>
      <div className="archive-list archive-list--large">{relatedCases.map((record) => <ArchiveRow key={record.id} record={record} />)}</div>
    </PageTransition>
  );
}
