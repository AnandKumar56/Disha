import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

const TestConsumer = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('defaults to English', () => {
    render(<LanguageProvider><TestConsumer /></LanguageProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('switches to Hindi on toggle', () => {
    render(<LanguageProvider><TestConsumer /></LanguageProvider>);
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('lang').textContent).toBe('hi');
  });
});
