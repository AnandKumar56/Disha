import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { Eligibility } from '../pages/Eligibility';
import { describe, it, expect } from 'vitest';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </LanguageProvider>
  );
}

describe('Eligibility', () => {
  it('renders Q1 with Yes/No buttons', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText('Are you a citizen of India?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows Question 1 of 3', () => {
    renderWithProviders(<Eligibility />);
    expect(screen.getByText(/Question 1 of 3/i)).toBeInTheDocument();
  });

  it('advances to Q2 after Yes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText('Are you 18 years or older?')).toBeInTheDocument();
    expect(screen.getByText(/Question 2 of 3/i)).toBeInTheDocument();
  });

  it('shows eligible result when all Yes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    await user.click(screen.getByText('Yes'));
    await user.click(screen.getByText('Yes'));
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText('You are eligible to vote!')).toBeInTheDocument();
  });

  it('shows ineligible result when any No', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Eligibility />);
    await user.click(screen.getByText('No'));
    await user.click(screen.getByText('Yes'));
    await user.click(screen.getByText('Yes'));
    expect(screen.getByText(/might not be eligible/i)).toBeInTheDocument();
  });
});
