import { execSync } from 'child_process';

export class CommandRunner {
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;

  constructor() {
    this.stdin = process.stdin;
    this.stdout = process.stdout;
    this.stderr = process.stderr;
  }

  run(command: string) {
    console.log(`Running command: ${command}`);

    return execSync(command, {
      stdio: [this.stdin, this.stdout, this.stderr],
    });
  }
}
