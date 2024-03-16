import { dev, prod } from '.';
import { CommandRunner } from '../utils/command-runner';

const commandRunner = new CommandRunner();

dev(() => {
  // Add dev jobs here.
  commandRunner.run(`npx ts-node ${__dirname}/test-job.ts`);
});

prod(() => {
  // Add prod jobs here.
  // commandRunner.run(`npx ts-node ${__dirname}/test-job.ts`);
});
