import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import DishaLogo from './DishaLogo';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/timeline", label: t("timeline") },
    { to: "/eligibility", label: t("eligibility") },
    { to: "/chat", label: t("chat") },
    { to: "/learn", label: t("learn") },
    { to: "/register", label: t("register") },
  ];

  return (
    <nav role="navigation" aria-label="Main navigation" className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex-col sm:flex-row items-center justify-between sticky top-0 z-50">
       <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
            {/* Logo */}
            <NavLink to="/" className="hover:opacity-90 transition-opacity">
                <DishaLogo />
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
                <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                    `transition-colors pb-1 border-b-2 ${
                    isActive
                        ? "text-[var(--color-primary)] border-[var(--color-primary)]"
                        : "border-transparent hover:text-gray-900"
                    }`
                }
                >
                {link.label}
                </NavLink>
            ))}
            </div>
        </div>

        <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
                onClick={toggleLanguage}
                aria-label={language === 'en' ? "Switch language to Hindi" : "Switch language to English"}
                className="hidden md:flex px-3 py-1 border border-gray-300 rounded-[8px] text-xs font-bold gap-2 items-center"
            >
                <span className={language === 'en' ? 'text-[var(--color-primary)]' : 'text-gray-400 font-normal'}>EN</span>
                <span className="text-gray-300 pointer-events-none">|</span>
                <span className={language === 'hi' ? 'text-[var(--color-secondary)]' : 'text-gray-400 font-normal'}>हि</span>
            </button>

            {/* Mobile menu button & Mobile Lang Toggle */}
            <div className="flex items-center md:hidden gap-4">
            <button
                onClick={toggleLanguage}
                aria-label={language === 'en' ? "Switch language to Hindi" : "Switch language to English"}
                className="text-xs font-bold text-gray-600 border border-gray-300 rounded-[8px] px-2 py-1"
            >
                {language === 'en' ? 'EN' : 'हि'}
            </button>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[var(--color-text-primary)] p-2"
                aria-expanded={isMenuOpen}
                aria-label="Open main menu"
            >
                {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
            </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden w-full max-w-7xl mx-auto border-t border-[var(--color-border)] mt-3 pt-3">
          <div className="px-2 space-y-1 bg-white">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-[var(--color-primary)] bg-orange-50"
                      : "text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-orange-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
