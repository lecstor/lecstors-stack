import { Command } from "makitso";

export function help({ command }: { command: Command }) {
  const args = command.arguments
    ? `  Args:\n    ${command.arguments.join("\n    ")}\n`
    : "";
  const opts = command.options
    ? `  Options:\n    ${command.options.join("\n    ")}`
    : "";
  return `${args}${opts}`;
}
