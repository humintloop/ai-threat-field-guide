import { Fragment } from 'react';

/** Render the limited link syntax in the pinned source without interpreting HTML. */
export function CanonicalAccount({ text }: { text: string }) {
  return <div className="canonical-account">{text.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph.split(/(\[\[[^\]]+\]\]|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, i) => {
    if (part.startsWith('[[')) return <a key={i} className="canonical-citation" href="#evidence" aria-label={`Source reference: ${part.slice(2, -2)}`}><sup>[source]</sup></a>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    return link ? <a key={i} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a> : <Fragment key={i}>{part}</Fragment>;
  })}</p>)}<a href="#evidence">See the sources this account cites ↓</a></div>;
}
