import { ArrowLeft } from "@phosphor-icons/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageTransition } from "../components/Motion";
import { ArchiveRow, PageHeader, Pill, SectionMarker } from "../components/ResearchUI";
import { caseById, patternById, seed, techniqueById } from "../data/model";

export function TechniqueDetailPage() {
  const { id } = useParams();
  const technique = id ? techniqueById.get(decodeURIComponent(id)) : undefined;
  if (!technique) return <Navigate to="/not-found" replace />;
  const relatedCases = technique.caseIds.flatMap((caseId) => caseById.get(caseId) ? [caseById.get(caseId)!] : []);
  const relatedPatterns = technique.patternIds.flatMap((patternId) => patternById.get(patternId) ? [patternById.get(patternId)!] : []);

  return (
    <PageTransition>
      <Link className="back-link" to="/techniques"><ArrowLeft size={16} /> Back to techniques</Link>
      <PageHeader eyebrow={`MITRE ATLAS / ${seed.atlas_snapshot.version}`} title={technique.name} description={`${technique.id} is represented by ${relatedCases.length} case relationship${relatedCases.length === 1 ? "" : "s"} in the current dataset.`} aside={<Pill tone="official">{technique.id}</Pill>} />
      {relatedPatterns.length > 0 && <><SectionMarker>Anchored patterns</SectionMarker><div className="related-grid">{relatedPatterns.map((pattern) => <Link key={pattern.id} to={`/patterns/${pattern.id}`}><span>{pattern.id}</span><strong>{pattern.name}</strong><p>{pattern.description}</p></Link>)}</div></>}
      <SectionMarker>Related cases</SectionMarker>
      <div className="archive-list archive-list--large">{relatedCases.map((record) => <ArchiveRow key={record.id} record={record} />)}</div>
    </PageTransition>
  );
}
