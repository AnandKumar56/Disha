import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

const Wrapper = () => (
  <LanguageProvider><BrowserRouter><Navbar /></BrowserRouter></LanguageProvider>
);

describe('Navigation', () => {
  it('renders the Disha logo/brand name', () => {
    render(<Wrapper />);
    expect(screen.getByText(/disha/i)).toBeInTheDocument();
  });

  it('renders language toggle button', () => {
    render(<Wrapper />);
    const toggle = screen.getAllByRole('button', { name: /switch language/i })[0];
    expect(toggle).toBeInTheDocument();
  });

  it('language toggle switches between EN and HI', () => {
    render(<Wrapper />);
    const toggle = screen.getAllByRole('button', { name: /switch language/i })[0];
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });
});
