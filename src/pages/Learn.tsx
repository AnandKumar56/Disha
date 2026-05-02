import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const Learn: React.FC = () => {
  const { t } = useLanguage();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'EVM & VVPAT Explained | Disha';
  }, []);

  const toggleCard = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  const cards = [
    {
      id: 1,
      title: t('q1Title'),
      short: t('q1Short'),
      long: t('q1Long'),
    },
    {
      id: 2,
      title: t('q2Title'),
      short: t('q2Short'),
      long: t('q2Long'),
    },
    {
      id: 3,
      title: t('q3Title'),
      short: t('q3Short'),
      long: t('q3Long'),
    },
    {
      id: 4,
      title: t('q4Title'),
      short: t('q4Short'),
      long: t('q4Long'),
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
         <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('learnTitle')}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          {t('learnSubtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {cards.map((card, index) => {
          const isExpanded = expandedCard === index;
          return (
             <div key={card.id} className="card overflow-hidden">
               <div 
                  role="button"
                  aria-expanded={isExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCard(index);
                    }
                  }}
                  className="p-6 cursor-pointer flex items-start gap-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-[8px]"
                  onClick={() => toggleCard(index)}
                >
                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[var(--color-primary)] font-bold">{card.id}</span>
                   </div>
                   <div className="flex-1">
                      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 flex justify-between items-center">
                        {card.title}
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
                        )}
                      </h2>
                      <p className="text-[var(--color-text-secondary)]">
                        {card.short}
                      </p>
                      
                      <div className={`mt-4 pt-4 border-t border-[var(--color-border)] overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden py-0 border-transparent mt-0'}`}>
                        <p className="text-[var(--color-text-primary)] leading-relaxed">{card.long}</p>
                      </div>

                      {!isExpanded && (
                        <span className="mt-3 text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" aria-hidden="true" /> {t('readMore')}
                        </span>
                      )}
                   </div>
                </div>
             </div>
          )
        })}
      </div>
    </div>
  );
};
