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
      <Link className="back-link" to="/patterns"><ArrowLeft size={16} /> Back to recurring</Link>
      <PageHeader eyebrow={`${pattern.id} / Field Guide shape`} title={pattern.name} description={pattern.description} aside={<div className="record-count"><strong>{relatedCases.length}</strong><span>related case{relatedCases.length === 1 ? "" : "s"}</span></div>} />
      <div className="pattern-detail-summary">
        <div><span>Closest ATLAS method</span><Link to={`/techniques/${encodeURIComponent(pattern.primary_atlas_technique)}`}><Pill tone="official">{pattern.primary_atlas_technique}</Pill><strong>{technique?.name ?? pattern.primary_atlas_technique}</strong><ArrowRight size={17} /></Link></div>
        <div><span>What this is</span><strong>A Field Guide reading</strong><small>Not an official MITRE technique. Editors named this shape; it is not extra evidence.</small></div>
      </div>
      <SectionMarker>Cases that show this shape</SectionMarker>
      <div className="archive-list archive-list--large">{relatedCases.map((record) => <ArchiveRow key={record.id} record={record} />)}</div>
    </PageTransition>
  );
}
