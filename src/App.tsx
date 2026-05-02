/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Timeline = lazy(() => import('./pages/Timeline').then(m => ({ default: m.Timeline })));
const Eligibility = lazy(() => import('./pages/Eligibility').then(m => ({ default: m.Eligibility })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Learn = lazy(() => import('./pages/Learn').then(m => ({ default: m.Learn })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{animationDelay:'300ms'}}></div>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="eligibility" element={<Eligibility />} />
                <Route path="chat" element={<Chat />} />
                <Route path="learn" element={<Learn />} />
                <Route path="register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
