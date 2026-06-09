import ora from 'ora';

import { fetchPaste } from '../api.js';
import { copyToClipboard } from '../clipboard.js';
import { normalizeCode, printSuccess, writeText } from '../utils.js';

export async function handleFetch(code) {
  const normalizedCode = normalizeCode(code);
  const spinner = process.stderr.isTTY ? ora('Fetching paste...').start() : null;

  try {
    const result = await fetchPaste(normalizedCode);

    if (typeof result.content !== 'string' || result.content.length === 0) {
      throw new Error('Empty content');
    }

    try {
      await copyToClipboard(result.content);
      spinner?.stop();
      printSuccess('Copied to clipboard');
    } catch (error) {
      spinner?.stop();

      if (error?.message === 'Clipboard unavailable') {
        process.stderr.write('Clipboard unavailable.\n');
        process.stdout.write('Content:\n');
        writeText(result.content);
        return;
      }

      throw error;
    }
  } catch (error) {
    spinner?.stop();
    throw error;
  }
}
