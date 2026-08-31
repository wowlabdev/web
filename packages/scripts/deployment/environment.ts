import { parse } from "dotenv";
import { readFile } from "node:fs/promises";

const NAME = /^NEXT_PUBLIC_[A-Z0-9_]+$/;
const VALUE = /^[a-zA-Z0-9_./:@%+=,-]+$/;

export async function loadPublicEnvironment(
  path: string,
): Promise<Record<string, string>> {
  return parsePublicEnvironment(await readFile(path), path);
}

export function parsePublicEnvironment(
  contents: Buffer | string,
  source = "environment file",
): Record<string, string> {
  const environment = parse(contents);

  for (const [name, value] of Object.entries(environment)) {
    if (!NAME.test(name)) {
      throw new Error(`${source} contains non-public variable ${name}`);
    }

    if (!VALUE.test(value)) {
      throw new Error(`${source} contains an unsupported value for ${name}`);
    }
  }

  return environment;
}

export function wranglerVariables(
  environment: Record<string, string>,
): string[] {
  return Object.entries(environment).flatMap(([name, value]) => [
    "--var",
    `${name}:${value}`,
  ]);
}
