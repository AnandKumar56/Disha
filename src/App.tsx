/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Timeline } from './pages/Timeline';
import { Eligibility } from './pages/Eligibility';
import { Chat } from './pages/Chat';
import { Learn } from './pages/Learn';
import { Register } from './pages/Register';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
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
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
