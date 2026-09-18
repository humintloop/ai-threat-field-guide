import { useId, useState } from 'react';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { cases } from '../data/model';
import { trail, type TrailStory } from '../data/trail';

export function ArrangementMark({ tone, label }: { tone: TrailStory['tone']; label: string }) {
  const kind = tone === 'mint' ? 'isolated' : tone === 'violet' ? 'fanout' : 'deadend';
  return <ol className={`arrangement-mark arrangement-mark--${kind}`} aria-label={label}>
    <li aria-hidden="true" /><li aria-hidden="true" /><li aria-hidden="true" />
  </ol>;
}

function reportTitle(url: string) {
  for (const record of cases) {
    const named = record.source_records.find((source) => source.url === url);
    if (named) return named.title;
  }
  return new URL(url).hostname.replace(/^www\./, '');
}

export function Receipt({ url }: { url: string }) {
  return <a className="story-receipt" href={url} target="_blank" rel="noreferrer">{reportTitle(url)} ↗</a>;
}

export function MechanismExplorer({ story }: { story: TrailStory }) {
  const [step, setStep] = useState(0);
  const panelId = useId();
  const current = story.steps[step];
  const linked = current.stage === 'relay' || current.stage === 'return' || current.stage === 'deadend';
  return <section className={`mechanism tone-${story.tone} mechanism--step-${step}`} aria-label={`${story.mechanism}: interactive explanation`}>
    <div className="mechanism-top">
      <span className="eyebrow">How it works</span>
      <div className="mechanism-pager">
        <button type="button" aria-label="Previous explanation step" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={18} /></button>
        <button type="button" aria-label="Next explanation step" disabled={step === 2} onClick={() => setStep(step + 1)}><ArrowRight size={18} /></button>
      </div>
    </div>
    <div className="step-buttons" aria-label="Explanation steps">
      {story.steps.map((item, index) => <button key={item.title} type="button" data-step={index} aria-label={`0${index + 1} ${item.title}`} aria-pressed={step === index} aria-controls={panelId} onClick={() => setStep(index)}><span>0{index + 1}</span>{item.title}</button>)}
    </div>
    <div id={panelId} className="mechanism-panel" aria-live="polite" aria-atomic="true">
      <ol key={`flow-${step}`} className={`mechanism-flow mechanism-flow--${current.stage}`} aria-label={current.title}>
        {current.nodes.map((node, index) => <li key={node}><span>{node}</span>{linked && index < current.nodes.length - 1 && <ArrowRight size={22} aria-hidden="true" />}</li>)}
      </ol>
      <div key={`read-${step}`} className="mechanism-read">
        <p className="mechanism-caption"><span>0{step + 1} · In this step</span>{current.caption}</p>
        <p>{current.text}</p>
        <Receipt url={current.source} />
      </div>
      <small className="mechanism-note">Illustrative explanation · not a source capture</small>
    </div>
  </section>;
}

export function TrailNav({ current }: { current?: string }) {
  return <nav className="trail-nav" aria-label="Who's directing the attack? trail">
    {trail.map((story, i) => <Link key={story.caseId} className={`tone-${story.tone}`} aria-current={current === story.caseId ? 'page' : undefined} to={`/incidents/${story.caseId}`}><span>0{i + 1}</span><strong>{story.mechanism}</strong><ArrowRight size={17} aria-hidden="true" /></Link>)}
  </nav>;
}

export function TrailNarrative({ story }: { story: TrailStory }) {
  return <div className={`story-narrative tone-${story.tone}`}>
    <div className="story-intro"><span className="eyebrow">Field Guide interpretation · based on cited sources</span><p>{story.hook}</p></div>
    <MechanismExplorer key={story.caseId} story={story} />
    {story.sections.map((section, index) => <section className="story-section" key={section.title}><span className="story-section-number">0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p><Receipt url={section.source} />{section.additionalSource && <> · <Receipt url={section.additionalSource} /></>}</div></section>)}
    <aside className="story-distinction"><span className="eyebrow">What this comparison shows</span><h2>{story.distinction.title}</h2><p>{story.distinction.text}</p><Receipt url={story.distinction.source} /></aside>
  </div>;
}

export function KeepGoing({ story }: { story: TrailStory }) {
  const last = story === trail[trail.length - 1];
  return <section className={`keep-going tone-${story.tone}`}>
    {last && <div className="trail-comparison"><span className="eyebrow">Three separate incidents</span><h2>Three ways agent activity was organized or adapted.</h2><div className="comparison-grid">{trail.map((item, i) => <article className={`tone-${item.tone}`} key={item.caseId}><span>0{i + 1}</span><h3>{item.mechanism}</h3><p>{item.pitch}</p><Link to={`/incidents/${item.caseId}`}>Revisit the case <ArrowRight size={16} /></Link><Receipt url={item.sections[0].source} /></article>)}</div></div>}
    <span className="eyebrow">Continue · {story.onward.reference ? 'Leaving the trail' : 'Editorial comparison'}</span>
    <Link className="onward-link" to={`/incidents/${story.onward.caseId}`}><h2>{story.onward.title}</h2><ArrowRight size={36} /></Link>
    <p>{story.onward.reason}</p>
    <Receipt url={story.onward.source} />
    <small className="connection-note">{story.onward.reference ? 'The next page is a standard case record.' : 'Chosen by the Field Guide editors; not an official ATLAS relationship.'}</small>
  </section>;
}
