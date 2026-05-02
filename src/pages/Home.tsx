import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Vote, CheckCircle, Globe, Lightbulb } from 'lucide-react';
import { trackEvent, trackPageView } from '../utils/analytics';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Disha — Your Guide to India\'s Elections';
    trackPageView('home');
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  const cards = [
    {
      id: 'first_time_voter',
      title: t('firstTimeVoter'),
      icon: <Vote className="w-8 h-8 text-[var(--color-primary)]" aria-hidden="true" />,
      path: '/eligibility',
      bg: 'bg-orange-50'
    },
    {
      id: 'returning_voter',
      title: t('returningVoter'),
      icon: <CheckCircle className="w-8 h-8 text-[var(--color-secondary)]" aria-hidden="true" />,
      path: '/timeline',
      bg: 'bg-green-50'
    },
    {
      id: 'nri_voter',
      title: t('nriVoter'),
      icon: <Globe className="w-8 h-8 text-blue-500" aria-hidden="true" />,
      path: '/register',
      bg: 'bg-blue-50'
    },
    {
      id: 'just_curious',
      title: t('justCurious'),
      icon: <Lightbulb className="w-8 h-8 text-purple-500" aria-hidden="true" />,
      path: '/chat',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-8">
      {/* Hero Section */}
      <section className="text-center px-4">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {language === 'en' ? t('homeHeadline') : "Disha — Your guide to India's elections"}
          </h1>
          {language === 'hi' && (
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-500 mt-2 tracking-tight">
              {t('homeHeadline')}
            </h2>
          )}
        </div>
        <p className="text-lg md:text-xl text-gray-600 font-medium">
          {t('homeSubtitle')}
        </p>
      </section>

      {/* Grid of Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            role="button"
            tabIndex={0}
            onClick={() => { trackEvent('journey_selected', { journey: card.id }); navigate(card.path); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                trackEvent('journey_selected', { journey: card.id });
                handleKeyDown(e, card.path);
              }
            }}
            aria-label={`Navigate to ${card.title}`}
            className="card flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <span className="text-xl font-bold text-gray-900">{card.title}</span>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pt-8 md:pt-4 border-t border-gray-200">
        <div className="text-center p-4">
          <p className="text-lg font-bold text-gray-900">{t('statVoters')}</p>
        </div>
        <div className="text-center p-4 border-t md:border-t-0 md:border-x border-gray-200">
          <p className="text-lg font-bold text-gray-900">{t('statSeats')}</p>
        </div>
        <div className="text-center p-4 border-t md:border-t-0 border-gray-200">
          <p className="text-lg font-bold text-gray-900">{t('statRounds')}</p>
        </div>
      </section>
    </div>
  );
};
