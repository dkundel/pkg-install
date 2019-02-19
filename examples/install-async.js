#!/usr/bin/env node

const ora = require('ora');
const { install } = require('../lib');

(async () => {
  const spinner = ora('Installing packages').start();

  const { stdout } = await install(
    {
      twilio: '~3.1',
      react: '^15',
      'node-env-run': '*',
    }
  );
  spinner.succeed();
  console.log(stdout);
})();
