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
      <PageHeader eyebrow={`${pattern.id} / Field Guide pattern`} title={pattern.name} description={pattern.description} aside={<div className="record-count"><strong>{relatedCases.length}</strong><span>related case{relatedCases.length === 1 ? "" : "s"}</span></div>} />
      <div className="pattern-detail-summary">
        <div><span>Related ATLAS technique</span><Link to={`/techniques/${encodeURIComponent(pattern.primary_atlas_technique)}`}><Pill tone="official">{pattern.primary_atlas_technique}</Pill><strong>{technique?.name ?? pattern.primary_atlas_technique}</strong><ArrowRight size={17} /></Link></div>
        <div><span>About this pattern</span><strong>Field Guide interpretation</strong><small>This is not an official MITRE technique or additional evidence. It is an editorial label for comparing the related case{relatedCases.length === 1 ? "" : "s"}.</small></div>
      </div>
      <SectionMarker>Related cases</SectionMarker>
      <div className="archive-list archive-list--large">{relatedCases.map((record) => <ArchiveRow key={record.id} record={record} />)}</div>
    </PageTransition>
  );
}
