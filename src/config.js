const DEFAULT_API_URL = 'https://api.freecodetools.dev';

export function getApiUrl() {
  const rawUrl = process.env.KOPPIE_API_URL?.trim() || DEFAULT_API_URL;

  try {
    const resolvedUrl = new URL(rawUrl);
    return resolvedUrl.toString().replace(/\/$/, '');
  } catch {
    throw new Error('Invalid KOPPIE_API_URL');
  }
}

export { DEFAULT_API_URL };
