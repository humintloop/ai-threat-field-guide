import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import axe from 'axe-core';
import { KeepGoing, MechanismExplorer, TrailNarrative } from './TrailExperience';
import { trail } from '../data/trail';
import { caseById } from '../data/model';

describe('curiosity trail', () => {
  it('uses existing cases and source references declared by each supporting record', () => {
    for (const story of trail) {
      const record = caseById.get(story.caseId)!;
      expect(record).toBeDefined();
      for (const section of [...story.sections, ...story.steps, story.distinction]) {
        expect(record.sources).toContain(section.source);
        if (section.additionalSource) expect(record.sources).toContain(section.additionalSource);
      }
      const next = caseById.get(story.onward.caseId)!;
      expect(next).toBeDefined();
      expect(next.sources).toContain(story.onward.source);
    }
    expect(trail.map(s => s.onward.caseId)).toEqual(['ATFG-0002', 'ATFG-0004', 'ATFG-0010']);
  });

  it('reveals each explanation through keyboard-operable controls and bounds navigation', async () => {
    const user = userEvent.setup();
    render(<MechanismExplorer story={trail[0]} />);
    expect(screen.getByRole('link', { name: 'Hugging Face Incident and the Road Ahead ↗' })).toHaveAttribute('href', trail[0].steps[0].source);
    const second = screen.getByRole('button', { name: /02 Leave a named folder/ });
    second.focus();
    await user.keyboard('{Enter}');
    expect(second).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Create a folder')).toBeVisible();
    expect(screen.getByText(/unauthenticated WebDAV MKCOL path/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Next explanation step' }));
    expect(screen.getByText('Post a finding')).toBeVisible();
    expect(screen.getByText(/1,200 runs exchanged more than 70,000 messages/)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next explanation step' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Previous explanation step' }));
    expect(second).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: /01 Work the puzzles/ }));
    expect(document.querySelector('.mechanism-flow--isolated')).toBeTruthy();
    expect(document.querySelector('.mechanism-flow--isolated svg')).toBeNull();
    expect(document.querySelector('.mechanism--step-0')).toBeTruthy();
    await user.click(second);
    expect(document.querySelector('.mechanism--step-1')).toBeTruthy();
  });

  it('keeps the failed outcome in the narrative and labels the final onward destination', () => {
    render(<MemoryRouter><TrailNarrative story={trail[2]} /><KeepGoing story={trail[2]} /></MemoryRouter>);
    expect(screen.getByText(/None of the autonomous exploitation attempts/)).toBeVisible();
    expect(screen.getByText(/Keep going · Leaving the essay/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'LAMEHUG calls a model to generate the next command.' })).toHaveAttribute('href', '/incidents/ATFG-0010');
    expect(screen.getByText('Three separate incidents')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'A shared board, an assigned team, and one agent.' })).toBeVisible();
  });

  it('labels Field Guide interpretation and does not invent a director for the Artifactory case', () => {
    render(<MemoryRouter><TrailNarrative story={trail[0]} /></MemoryRouter>);
    expect(screen.getByText('Editorial reading')).toBeVisible();
    expect(screen.getByText(/names no operator assigning specialist roles/)).toBeVisible();
    expect(screen.queryByText(/No manager/)).toBeNull();
  });

  it('keeps the Taiwan case’s unknown-operator limit in the essay', () => {
    render(<MemoryRouter><TrailNarrative story={trail[1]} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'MITRE lists an unknown Chinese-language operator.' })).toBeVisible();
    expect(screen.getByText(/MODA separately confirmed detecting abnormal July attacks/)).toBeVisible();
  });

  it('has no automatically detectable accessibility violations in the pilot interaction', async () => {
    const { container } = render(<MemoryRouter><TrailNarrative story={trail[0]} /><KeepGoing story={trail[0]} /></MemoryRouter>);
    const result = await axe.run(container, { rules: { region: { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
