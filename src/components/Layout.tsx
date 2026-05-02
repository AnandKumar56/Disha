import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg)] text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
