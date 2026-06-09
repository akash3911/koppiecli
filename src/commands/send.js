import ora from 'ora';

import { createPaste } from '../api.js';
import { normalizeContent, readMultilineInput, writeText } from '../utils.js';

function normalizeTextParts(textParts) {
  if (Array.isArray(textParts)) {
    return textParts.join(' ');
  }

  if (typeof textParts === 'string') {
    return textParts;
  }

  return '';
}

export async function handleSend(textParts, options = {}) {
  let content = normalizeTextParts(textParts);

  if (!content) {
    content = await readMultilineInput('Paste text:');
  }

  const normalizedContent = normalizeContent(content);
  const spinner = process.stderr.isTTY ? ora('Uploading paste...').start() : null;

  try {
    const result = await createPaste({
      content: normalizedContent,
      expire: options.expire,
    });

    spinner?.stop();
    writeText(result.code);
  } catch (error) {
    spinner?.stop();
    throw error;
  }
}
