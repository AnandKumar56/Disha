import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { Timeline } from '../pages/Timeline';

const Wrapper = () => (
  <LanguageProvider><BrowserRouter><Timeline /></BrowserRouter></LanguageProvider>
);

describe('Timeline Page', () => {
  it('renders the Election Timeline heading', () => {
    render(<Wrapper />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all 7 phase cards', () => {
    render(<Wrapper />);
    const phases = screen.getAllByRole('button');
    expect(phases.length).toBeGreaterThanOrEqual(7);
  });

  it('expands a phase card on click', () => {
    render(<Wrapper />);
    const firstPhase = screen.getAllByRole('button')[0];
    fireEvent.click(firstPhase);
    expect(firstPhase).toHaveAttribute('aria-expanded', 'true');
  });
});
