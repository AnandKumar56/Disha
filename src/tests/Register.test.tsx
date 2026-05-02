import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../pages/Register';

const Wrapper = () => (
  <LanguageProvider><BrowserRouter><Register /></BrowserRouter></LanguageProvider>
);

describe('Register Page', () => {
  it('renders the Register to Vote heading', () => {
    render(<Wrapper />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the ECI register link', () => {
    render(<Wrapper />);
    const registerLink = screen.getByRole('link', { name: /register now/i });
    expect(registerLink).toHaveAttribute('href', 'https://voters.eci.gov.in');
  });

  it('renders the electoral search link', () => {
    render(<Wrapper />);
    const searchLink = screen.getByRole('link', { name: /check your name/i });
    expect(searchLink).toHaveAttribute('href', 'https://electoralsearch.eci.gov.in');
  });
});
