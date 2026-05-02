import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { Learn } from '../pages/Learn';

const Wrapper = () => (
  <LanguageProvider><BrowserRouter><Learn /></BrowserRouter></LanguageProvider>
);

describe('Learn Page', () => {
  it('renders the EVM & VVPAT heading', () => {
    render(<Wrapper />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all 4 explainer cards', () => {
    render(<Wrapper />);
    const cards = screen.getAllByRole('button');
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it('renders NOTA section', () => {
    render(<Wrapper />);
    expect(screen.getAllByText(/NOTA/i)[0]).toBeInTheDocument();
  });
});
