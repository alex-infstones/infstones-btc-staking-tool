#!/usr/bin/env node
"use strict";
const { program } = require('commander');
const { createUnsignedTransaction } = require('./stake');

program
  .version('1.0.0')
  .description('Core chain self custody BTC staking command line tool');

program
  .command('create-raw')
  .description('Generate a raw unsigned transaction for staking')
  .requiredOption('-n, --network <network>', 'Bitcoin network: testnet or bitcoin')
  .requiredOption('-l, --locktime <locktime>', 'Locktime for the transaction', parseInt)
  .requiredOption('-i, --inputs <inputs>', 'Transaction inputs as JSON string')
  .requiredOption('-o, --outputs <outputs>', 'Transaction outputs as JSON string')
  .action((options) => {
    const inputs = JSON.parse(options.inputs);
    const outputs = JSON.parse(options.outputs);
    const rawTx = createUnsignedTransaction({
      networkType: options.network,
      lockTime: options.locktime,
      inputs,
      outputs
    });
    console.log("Raw Unsigned Transaction:", rawTx);
  });

program.parse(process.argv);
