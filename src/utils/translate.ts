/**
 * Calls server-side Google Cloud Translation API.
 * Falls back to original text if translation fails.
 */
export const translateText = async (text: string, targetLang: 'hi' | 'en'): Promise<string> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    if (!response.ok) return text;
    const data = await response.json();
    return data.translatedText || text;
  } catch {
    return text;
  }
};
