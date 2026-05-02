import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Home } from '../pages/Home';
import { describe, it, expect } from 'vitest';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </LanguageProvider>
  );
}

describe('Home', () => {
  it('renders 4 journey cards', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('First-time voter')).toBeInTheDocument();
    expect(screen.getByText('Returning voter')).toBeInTheDocument();
    expect(screen.getByText('NRI voter')).toBeInTheDocument();
    expect(screen.getByText('Just curious')).toBeInTheDocument();
  });

  it('renders headline', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders stat blocks', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('950M+ registered voters')).toBeInTheDocument();
    expect(screen.getByText('543 Lok Sabha seats')).toBeInTheDocument();
  });
});
