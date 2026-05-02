import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'Register to Vote | Disha';
  }, []);

  const steps = [
    t('step1'),
    t('step2'),
    t('step3'),
    t('step4'),
    t('step5'),
    t('step6'),
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('registerTitle')}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          {t('registerSubtitle')}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-5 mb-6 flex gap-3 items-start">
        <span className="text-blue-500 text-xl mt-0.5">🌐</span>
        <div>
          <p className="font-bold text-blue-800 mb-1">{t('nriVoter')}</p>
          <p className="text-sm text-blue-700">{t('nriNote')}</p>
        </div>
      </div>

      <div className="card p-8 mb-8">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[var(--color-secondary)] font-bold">{index + 1}</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-lg text-[var(--color-text-primary)] font-medium">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="https://voters.eci.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`${t('btnRegister')} (opens in new tab)`}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {t('btnRegister')} <ExternalLink size={18} aria-hidden="true" />
        </a>
        <a 
          href="https://electoralsearch.eci.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={`${t('btnStatus')} (opens in new tab)`}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          {t('btnStatus')} <ExternalLink size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
