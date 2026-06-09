import readline from 'node:readline';
import process from 'node:process';

import chalk from 'chalk';

export class KoppieError extends Error {
  constructor(message, { kind = 'generic', exitCode = 1, cause } = {}) {
    super(message);
    this.name = 'KoppieError';
    this.kind = kind;
    this.exitCode = exitCode;

    if (cause) {
      this.cause = cause;
    }
  }
}

export function validateCode(code) {
  return typeof code === 'string' && /^[0-9]{4}$/.test(code.trim());
}

export function normalizeCode(code) {
  if (typeof code !== 'string') {
    throw new KoppieError('Invalid code');
  }

  const normalized = code.trim().toUpperCase();

  if (!validateCode(normalized)) {
    throw new KoppieError('Invalid code');
  }

  return normalized;
}

export function normalizeContent(content) {
  if (typeof content !== 'string') {
    throw new KoppieError('Empty content');
  }

  const normalized = content.replace(/\r\n/g, '\n');

  if (normalized.trim().length === 0) {
    throw new KoppieError('Empty content');
  }

  return normalized;
}

export function printError(message) {
  process.stderr.write(`${chalk.red('✗')} ${message}\n`);
}

export function printSuccess(message) {
  process.stdout.write(`${chalk.green('✓')} ${message}\n`);
}

export function writeText(text) {
  process.stdout.write(text);

  if (!text.endsWith('\n')) {
    process.stdout.write('\n');
  }
}

export function readAllFromStream(stream) {
  return new Promise((resolve, reject) => {
    let buffer = '';

    stream.setEncoding('utf8');

    stream.on('data', (chunk) => {
      buffer += chunk;
    });

    stream.on('end', () => {
      resolve(buffer);
    });

    stream.on('error', reject);
  });
}

export async function readMultilineInput(promptText = 'Paste text:') {
  if (!process.stdin.isTTY) {
    return readAllFromStream(process.stdin);
  }

  return new Promise((resolve, reject) => {
    const lines = [];
    const interfaceInstance = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    process.stdout.write(`${promptText}\n`);
    interfaceInstance.setPrompt('> ');
    interfaceInstance.prompt();

    interfaceInstance.on('line', (line) => {
      lines.push(line);
      interfaceInstance.prompt();
    });

    interfaceInstance.on('close', () => {
      resolve(lines.join('\n'));
    });

    interfaceInstance.on('SIGINT', () => {
      interfaceInstance.close();
      reject(new KoppieError('Aborted'));
    });
  });
}
