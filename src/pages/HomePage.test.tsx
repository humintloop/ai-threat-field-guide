import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('homepage trail map', () => {
  it('asks one question without dumping the three plots into the hero', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Who’s directing\s*the attack\?/);
    expect(screen.getByText(/Each card is one case, with a mark for how the work was set up/)).toBeVisible();
    expect(screen.getByText(/They remain separate incidents/)).toBeVisible();
    expect(screen.queryByText(/Langflow/)).toBeNull();
    expect(screen.queryByText(/eight-agent framework/)).toBeNull();
    expect(screen.queryByText(/never got in/)).toBeNull();
    expect(screen.getByRole('link', { name: /Open this case/ })).toHaveAttribute('href', '/incidents/ATFG-0001');
    expect(screen.getAllByRole('link', { name: /Skip to this case/ })).toHaveLength(2);
  });
});
