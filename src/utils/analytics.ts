declare global {
  interface Window { gtag: (...args: unknown[]) => void; }
}

export const trackEvent = (eventName: string, params?: Record<string, string | number>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_title: pageName });
};
