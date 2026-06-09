#!/usr/bin/env node

import { Command, Option } from 'commander';
import { handleDelete } from '../src/commands/delete.js';
import { handleFetch } from '../src/commands/fetch.js';
import { handleSend } from '../src/commands/send.js';
import { handleView } from '../src/commands/view.js';
import { printError } from '../src/utils.js';

const program = new Command();

program
  .name('koppie')
  .description('Cross-device clipboard sharing utility')
  .version('1.0.0')
  .argument('[code]', '4-digit paste code to fetch and copy')
  .action(async (code) => {
    if (!code) {
      program.outputHelp();
      return;
    }

    await handleFetch(code);
  });

program
  .command('send')
  .description('Upload text to the server')
  .argument('[text...]', 'text to upload')
  .addOption(
    new Option('--expire <duration>', 'Set paste expiration').choices(['1h', '1d', '7d'])
  )
  .action(async (textParts, options) => {
    await handleSend(textParts, options);
  });

program
  .command('view')
  .description('Print a paste without copying it')
  .argument('<code>', '4-digit paste code to view')
  .action(async (code) => {
    await handleView(code);
  });

program
  .command('delete')
  .description('Delete a paste from the server')
  .argument('<code>', '4-digit paste code to delete')
  .action(async (code) => {
    await handleDelete(code);
  });

program.exitOverride();
program.showHelpAfterError();

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error?.code === 'commander.helpDisplayed') {
    process.exitCode = 0;
  } else {
    printError(error?.message ?? 'API error');
    process.exitCode = 1;
  }
}