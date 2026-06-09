import { fetchPaste } from '../api.js';
import { normalizeCode, writeText } from '../utils.js';

export async function handleView(code) {
  const normalizedCode = normalizeCode(code);
  const result = await fetchPaste(normalizedCode);

  if (typeof result.content !== 'string' || result.content.length === 0) {
    throw new Error('Empty content');
  }

  writeText(result.content);
}
