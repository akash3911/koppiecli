const DEFAULT_API_URL = 'https://koppie-api.vercel.app';

export function getApiUrl() {
  return (process.env.KOPPIE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}