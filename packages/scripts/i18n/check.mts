import { chalk, fs, glob, path } from "zx";

import {
  auditDictionaries,
  type Dictionary,
  parseDictionary,
} from "./audit.ts";

const directory = path.resolve(import.meta.dirname, "../../shared/src/i18n");
const sourceLocale = "en";
const dictionaries = new Map<string, Map<string, Dictionary>>();
const issues: string[] = [];
const files = (
  await glob("**/*.content.ts", { absolute: true, cwd: directory })
).toSorted((left, right) => left.localeCompare(right));

for (const file of files) {
  const [locale, ...fileParts] = path.relative(directory, file).split(path.sep);

  if (!locale || fileParts.length === 0) {
    issues.push(`${file}: expected a locale directory`);
    continue;
  }

  const catalog = dictionaries.get(locale) ?? new Map<string, Dictionary>();
  const relativeFile = fileParts.join(path.sep);

  try {
    const dictionary = parseDictionary(
      await fs.readFile(file, "utf8"),
      relativeFile,
      locale,
    );

    if (catalog.has(dictionary.key)) {
      issues.push(`${locale}: duplicate dictionary ${dictionary.key}`);
    } else {
      catalog.set(dictionary.key, dictionary);
    }
  } catch (error) {
    issues.push(error instanceof Error ? error.message : String(error));
  }

  dictionaries.set(locale, catalog);
}

issues.push(...auditDictionaries(dictionaries, sourceLocale));

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(chalk.red(`- ${issue}`));
  }

  process.exitCode = 1;
} else {
  console.log(
    chalk.green(
      `Checked ${dictionaries.get(sourceLocale)?.size ?? 0} dictionaries across ${dictionaries.size} locales.`,
    ),
  );
}
