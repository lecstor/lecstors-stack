import * as child from "child_process";

import shell from "shelljs";

export function executeSync(command: string, silent: boolean) {
  return shell.exec(command, { silent });
}

export type ExecOptions = {
  silent?: boolean;
  rejectCode?: boolean;
} & child.ExecOptions;

export async function execute(
  command: string,
  { rejectCode = true, ...options }: ExecOptions = {}
): Promise<string | { code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const callback: shell.ExecCallback = (code, stdout, stderr) => {
      if (rejectCode) {
        if (code) {
          reject(new Error(stderr));
        } else {
          resolve(stdout);
        }
      } else {
        resolve({ code, stdout, stderr });
      }
    };
    shell.exec(command, options, callback);
  });
}

export const execOptions: string[] = [
  // "-s --silent {boolean} - Do not echo program output to console (default: false)"
];
