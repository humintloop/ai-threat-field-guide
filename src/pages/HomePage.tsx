import { ArrowRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { caseById, cases, metrics, seed } from '../data/model';
import { trail } from '../data/trail';
import { ArrangementMark } from '../components/TrailExperience';
import { ArchiveRow, SectionMarker } from '../components/ResearchUI';

const trailIds = new Set(trail.map((story) => story.caseId));
const trailAtlasIds = trail
  .map((story) => caseById.get(story.caseId)?.atlas_case_id)
  .filter((id): id is string => Boolean(id));

export function HomePage() {
  const restOfArchive = cases.filter((record) => record.event_type === 'Incident' && !trailIds.has(record.id)).slice(0, 3);
  const archiveCount = metrics.incidents + metrics.research;

  return <>
    <section className="curiosity-hero tone-mint">
      <div className="curiosity-intro">
        <span className="eyebrow">One question · {trail.length} ATLAS incidents</span>
        <h1>Who’s directing<br />the attack<span>?</span></h1>
        <p className="hero-hook">Three incidents, three organizations.<br />Each card is one case, with a mark for how the work was set up.</p>
        <p>Start with the first case, or skip ahead. Editors put these {trail.length} MITRE ATLAS records in a reading order. They remain separate incidents.</p>
      </div>
      <ol className="trail-map">
        {trail.map((story, i) => (
          <li key={story.caseId} className={`trail-card tone-${story.tone}${i === 0 ? ' trail-card--start' : ''}`}>
            <div className="trail-card__meta"><span>0{i + 1}</span>{i === 0 ? <span>Start here</span> : <span>Skip here</span>}</div>
            <h2>{story.mechanism}</h2>
            <ArrangementMark tone={story.tone} label={`${story.mechanism} arrangement`} />
            <p>{story.pitch}</p>
            <Link to={`/incidents/${story.caseId}`}>{i === 0 ? 'Open this case' : 'Skip to this case'} <ArrowRight size={16} /></Link>
          </li>
        ))}
      </ol>
      <p className="trail-overview-note">{trailAtlasIds.join(', ')} — {trail.length} ATLAS records, arranged here as a reading order.</p>
    </section>
    <section className="home-section">
      <SectionMarker action={<Link to="/incidents">Browse all {archiveCount} records <ArrowRight size={15} /></Link>}>Recent incidents outside this trail</SectionMarker>
      <div className="archive-list">{restOfArchive.map((record) => <ArchiveRow key={record.id} record={record} compact />)}</div>
    </section>
    <section className="reference-invitation">
      <div>
        <span className="eyebrow">The rest of the guide</span>
        <h2>{archiveCount} records, {metrics.techniques} techniques, and the reports they cite.</h2>
        <p>{metrics.incidents} incidents and {metrics.research} research demonstration, pinned to MITRE ATLAS {seed.atlas_snapshot.version}. The demonstration stays labeled so it is not read as an in-the-wild attack.</p>
      </div>
      <div>
        <Link to="/network">See which cases share a technique <ArrowRight size={20} /></Link>
        <Link to="/sources">Open the {metrics.sources} cited reports <ArrowRight size={20} /></Link>
        <Link to="/about">How records are labeled <ArrowRight size={20} /></Link>
      </div>
    </section>
  </>;
}
