import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent, trackPageView } from '../utils/analytics';

export const Eligibility: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'Voter Eligibility Check | Disha';
    trackPageView('eligibility');
  }, []);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = [
    t('q1Text'),
    t('q2Text'),
    t('q3Text')
  ];

  const handleAnswer = (isYes: boolean) => {
    setAnswers([...answers, isYes]);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const resetCheck = () => {
    setCurrentStep(0);
    setAnswers([]);
  };

  const isComplete = currentStep >= questions.length;
  const isEligible = answers.every(v => v === true);

  useEffect(() => {
    if (isComplete) {
      trackEvent('eligibility_result', { result: isEligible ? 'eligible' : 'ineligible' });
    }
  }, [isComplete, isEligible]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('eligibilityTitle')}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          {t('eligibilitySubtitle')}
        </p>
      </div>

      <div className="card p-8 min-h-[300px] flex flex-col items-center justify-center relative">
        {!isComplete ? (
          <div className="w-full">
            <div role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={questions.length} className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
            </div>

            <div className="mb-8 text-center text-sm font-medium text-gray-500">
              {t('questionLabel')} {currentStep + 1} {t('of')} {questions.length}
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 min-h-[64px]">
              {questions[currentStep]}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => handleAnswer(true)}
                aria-label={`Answer yes to ${questions[currentStep]}`}
                className="w-full sm:w-auto min-w-[120px] px-6 py-4 bg-[var(--color-primary)] text-white font-bold rounded-[8px] hover:bg-[#E66000] focus:ring-4 focus:ring-orange-200 transition-colors"
              >
                {t('yes')}
              </button>
              <button
                onClick={() => handleAnswer(false)}
                aria-label={`Answer no to ${questions[currentStep]}`}
                className="w-full sm:w-auto min-w-[120px] px-6 py-4 bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] font-bold rounded-[8px] hover:bg-orange-50 focus:ring-4 focus:ring-orange-200 transition-colors"
              >
                {t('no')}
              </button>
            </div>

            {currentStep > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  <ArrowLeft size={16} aria-hidden="true" /> {t('back')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center w-full animate-in fade-in zoom-in duration-300">
            {isEligible ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-[var(--color-secondary)] mb-4" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-2">
                  {t('eligibleResult')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  {t('eligibleSubtext')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    {t('btnRegister')} <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <button
                    onClick={resetCheck}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} aria-hidden="true" /> {t('restartCheck')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('ineligibleResult')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  {t('ineligibleSubtext')}
                </p>
                <button
                  onClick={resetCheck}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} aria-hidden="true" /> {t('restartCheck')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
