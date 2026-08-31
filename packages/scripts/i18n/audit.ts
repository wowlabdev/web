import ts from "typescript";

export type Dictionaries = ReadonlyMap<string, ReadonlyMap<string, Dictionary>>;

export type Dictionary = {
  entries: ReadonlyMap<string, Entry>;
  file: string;
  formatIssues: readonly string[];
  key: string;
};

interface Entry {
  kind: string;
  placeholders: readonly string[];
}

export function auditDictionaries(
  dictionaries: Dictionaries,
  sourceLocale: string,
): string[] {
  const primary = dictionaries.get(sourceLocale);

  if (!primary) {
    return [`missing source locale ${sourceLocale}`];
  }

  const translations = [...dictionaries].filter(
    ([locale]) => locale !== sourceLocale,
  );

  return [
    ...collectFormatIssues(dictionaries),
    ...translations.flatMap(([locale, catalog]) =>
      compareCatalogs(primary, catalog, locale),
    ),
  ];
}

export function parseDictionary(
  code: string,
  file: string,
  locale: string,
): Dictionary {
  const source = ts.createSourceFile(
    file,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const exported = source.statements.find((statement) =>
    ts.isExportAssignment(statement),
  );

  if (!exported || !ts.isCallExpression(exported.expression)) {
    throw new Error(`${file}: expected a default dictionary export`);
  }

  const call = exported.expression;

  if (call.arguments.length !== 2) {
    throw new Error(`${file}: expected a dictionary key and body`);
  }

  if (!ts.isIdentifier(call.expression) || call.expression.text !== locale) {
    throw new Error(`${file}: expected the ${locale} locale factory`);
  }

  const [keyNode, contentNode] = call.arguments;

  if (!ts.isStringLiteral(keyNode)) {
    throw new Error(`${file}: expected a string dictionary key`);
  }

  if (!ts.isObjectLiteralExpression(contentNode)) {
    throw new Error(`${file}: expected an object dictionary body`);
  }

  const entries = new Map<string, Entry>();
  const formatIssues: string[] = [];

  collectEntries(contentNode, "", source, entries, formatIssues, file);

  return { entries, file, formatIssues, key: keyNode.text };
}

function collectEntries(
  object: ts.ObjectLiteralExpression,
  prefix: string,
  source: ts.SourceFile,
  entries: Map<string, Entry>,
  formatIssues: string[],
  file: string,
): void {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) {
      throw new Error(`${file}: dictionary entries must be properties`);
    }

    const name = propertyName(property.name);
    const key = prefix ? `${prefix}.${name}` : name;

    if (ts.isObjectLiteralExpression(property.initializer)) {
      collectEntries(
        property.initializer,
        key,
        source,
        entries,
        formatIssues,
        file,
      );
      continue;
    }

    if (entries.has(key)) {
      throw new Error(`${file}: duplicate key ${key}`);
    }

    const start = source.getLineAndCharacterOfPosition(
      property.getStart(),
    ).line;
    const end = source.getLineAndCharacterOfPosition(property.getEnd()).line;

    if (start !== end) {
      formatIssues.push(`${file}: ${key} must stay on one line`);
    }

    entries.set(key, {
      kind: entryKind(property.initializer),
      placeholders: collectPlaceholders(property.initializer),
    });
  }
}

function collectFormatIssues(dictionaries: Dictionaries): string[] {
  return [...dictionaries].flatMap(([locale, catalog]) =>
    [...catalog.values()].flatMap(({ formatIssues }) =>
      formatIssues.map((issue) => `${locale}: ${issue}`),
    ),
  );
}

function collectPlaceholders(node: ts.Node): string[] {
  const placeholders = new Set<string>();

  function visit(current: ts.Node): void {
    if (ts.isStringLiteralLike(current)) {
      for (const match of current.text.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)) {
        placeholders.add(match[1]);
      }
    }

    current.forEachChild(visit);
  }

  visit(node);

  return [...placeholders].toSorted((left, right) => left.localeCompare(right));
}

function compareCatalogs(
  primary: ReadonlyMap<string, Dictionary>,
  translated: ReadonlyMap<string, Dictionary>,
  locale: string,
): string[] {
  const issues: string[] = [];

  for (const [key, source] of primary) {
    const target = translated.get(key);

    if (!target) {
      issues.push(`${locale}: missing dictionary ${key}`);
      continue;
    }

    if (source.file !== target.file) {
      issues.push(
        `${locale}: dictionary ${key} is in ${target.file}, expected ${source.file}`,
      );
    }

    compareEntries(issues, key, locale, source.entries, target.entries);
  }

  for (const key of translated.keys()) {
    if (!primary.has(key)) {
      issues.push(`${locale}: unexpected dictionary ${key}`);
    }
  }

  return issues;
}

function compareEntries(
  issues: string[],
  dictionary: string,
  locale: string,
  source: ReadonlyMap<string, Entry>,
  target: ReadonlyMap<string, Entry>,
): void {
  for (const [key, expected] of source) {
    const actual = target.get(key);
    const label = `${locale}: ${dictionary}.${key}`;

    if (!actual) {
      issues.push(`${label} is missing`);
      continue;
    }

    if (actual.kind !== expected.kind) {
      issues.push(`${label} uses ${actual.kind}, expected ${expected.kind}`);
    }

    if (actual.placeholders.join("\0") !== expected.placeholders.join("\0")) {
      issues.push(
        `${label} has placeholders [${actual.placeholders.join(", ")}], expected [${expected.placeholders.join(", ")}]`,
      );
    }
  }

  for (const key of target.keys()) {
    if (!source.has(key)) {
      issues.push(`${locale}: ${dictionary}.${key} is unexpected`);
    }
  }
}

function entryKind(node: ts.Expression): string {
  if (ts.isStringLiteralLike(node)) {
    return "text";
  }

  if (ts.isCallExpression(node)) {
    return node.expression.getText();
  }

  return ts.SyntaxKind[node.kind];
}

function propertyName(name: ts.PropertyName): string {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteralLike(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }

  throw new Error("dictionary keys must be static");
}
