import { render, screen } from '@testing-library/react';
import { Chat } from '../pages/Chat';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider><BrowserRouter>{ui}</BrowserRouter></LanguageProvider>
  );
}

describe('Chat Page', () => {
  it('renders the 3 starter question buttons', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByText(/register to vote/i)).toBeInTheDocument();
    expect(screen.getByText(/NOTA/i)).toBeInTheDocument();
    expect(screen.getByText(/EVM/i)).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    renderWithProviders(<Chat />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('renders character counter showing 0/1000', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByText(/0\/1000/)).toBeInTheDocument();
  });
});
