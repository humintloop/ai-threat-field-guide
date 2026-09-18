import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('homepage trail map', () => {
  it('asks one question without dumping the three plots into the hero', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Who’s directing\s*the attack\?/);
    expect(screen.getByText(/Each case shows a different way agents coordinated or adapted/)).toBeVisible();
    expect(screen.getByText(/Field Guide comparison of 3 separate MITRE ATLAS records/)).toBeVisible();
    expect(screen.queryByText(/Langflow/)).toBeNull();
    expect(screen.queryByText(/eight-agent framework/)).toBeNull();
    expect(screen.queryByText(/never got in/)).toBeNull();
    expect(screen.getAllByRole('link', { name: /Open case/ })).toHaveLength(3);
  });
});
