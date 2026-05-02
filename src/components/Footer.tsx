import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
        <span className="text-sm font-semibold text-gray-700">Disha</span>
        <span className="text-xs text-gray-400">{t("slogan")}</span>
      </div>
      <div className="text-[10px] text-gray-400 max-w-lg text-center md:text-right">
        {t("disclaimer")}
      </div>
    </footer>
  );
};
