import { KoppieError } from './utils.js';

async function loadClipboardModule() {
  const clipboardModule = await import('clipboardy');
  return clipboardModule.default ?? clipboardModule;
}

export async function copyToClipboard(content) {
  try {
    const clipboard = await loadClipboardModule();

    if (typeof clipboard.write !== 'function') {
      throw new Error('clipboard write unavailable');
    }

    await clipboard.write(content);
  } catch (error) {
    throw new KoppieError('Clipboard unavailable', { kind: 'clipboard', cause: error });
  }
}
