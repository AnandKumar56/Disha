declare global {
  interface Window { gtag: (...args: unknown[]) => void; }
}

/**
 * Sends a custom event to Google Analytics 4.
 * @param eventName - GA4 event name (snake_case)
 * @param params - Optional event parameters
 */

export const trackEvent = (eventName: string, params?: Record<string, string | number>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_title: pageName });
};
