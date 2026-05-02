import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { trackEvent, trackPageView } from '../utils/analytics';

export const Timeline: React.FC = () => {
  const { t } = useLanguage();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Election Timeline | Disha';
    trackPageView('timeline');
  }, []);

  const phases = [
    { id: 1, name: t('ph1Name'), short: t('ph1Short'), long: t('ph1Long') },
    { id: 2, name: t('ph2Name'), short: t('ph2Short'), long: t('ph2Long') },
    { id: 3, name: t('ph3Name'), short: t('ph3Short'), long: t('ph3Long') },
    { id: 4, name: t('ph4Name'), short: t('ph4Short'), long: t('ph4Long') },
    { id: 5, name: t('ph5Name'), short: t('ph5Short'), long: t('ph5Long') },
    { id: 6, name: t('ph6Name'), short: t('ph6Short'), long: t('ph6Long') },
    { id: 7, name: t('ph7Name'), short: t('ph7Short'), long: t('ph7Long') },
  ];

  const togglePhase = (id: number) => {
    if (expandedPhase !== id) {
      trackEvent('timeline_phase_expanded', { phase: id });
    }
    setExpandedPhase(expandedPhase === id ? null : id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePhase(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          {t('timelineTitle')}
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          {t('timelineSubtitle')}
        </p>
      </div>

      <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-6">
        {phases.map((phase) => {
          const isExpanded = expandedPhase === phase.id;
          return (
            <div key={phase.id} className="relative pl-8 md:pl-10">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[17px] top-4 w-8 h-8 rounded-full border-4 border-[var(--color-bg)] flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                  isExpanded ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {phase.id}
              </div>

              {/* Phase Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => togglePhase(phase.id)}
                onKeyDown={(e) => handleKeyDown(e, phase.id)}
                aria-expanded={isExpanded}
                className={`bg-white border rounded-[8px] p-5 cursor-pointer text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  isExpanded
                    ? 'border-gray-200 border-l-[4px] border-l-[var(--color-primary)] shadow-md'
                    : 'border-gray-200 hover:border-gray-300 shadow-sm border-l-[4px] border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      {phase.name}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      {phase.short}
                    </p>
                  </div>
                  <button
                    className="flex-shrink-0 text-gray-400 hover:text-[var(--color-primary)] transition-colors p-1 focus:outline-none"
                    aria-label={isExpanded ? t('collapse') : t('expand')}
                    tabIndex={-1}
                  >
                    {isExpanded ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {phase.long}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
