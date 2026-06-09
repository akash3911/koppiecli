import ora from 'ora';

import { deletePaste } from '../api.js';
import { normalizeCode, printSuccess } from '../utils.js';

export async function handleDelete(code) {
  const normalizedCode = normalizeCode(code);
  const spinner = process.stderr.isTTY ? ora('Deleting paste...').start() : null;

  try {
    await deletePaste(normalizedCode);
    spinner?.stop();
    printSuccess('Deleted');
  } catch (error) {
    spinner?.stop();
    throw error;
  }
}
