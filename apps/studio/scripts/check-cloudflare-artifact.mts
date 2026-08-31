import { fs, path } from "zx";

const OPEN_NEXT = path.resolve(import.meta.dirname, "../.open-next");
const BUNDLE_DIRECTORIES = ["middleware", "server-functions"].map((directory) =>
  path.join(OPEN_NEXT, directory),
);
const FORBIDDEN_SOURCE = [
  "WebAssembly.compile",
  "code-transformer-bundler-plugins",
];

function bundleFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => ![".next", "node_modules"].includes(entry.name))
    .flatMap((entry) => {
      const file = path.join(directory, entry.name);

      return entry.isDirectory() ? bundleFiles(file) : [file];
    })
    .filter((file) => /\.[cm]?js$/u.test(file));
}

const files = [
  ...BUNDLE_DIRECTORIES.flatMap((directory) => bundleFiles(directory)),
  path.join(OPEN_NEXT, "worker.js"),
].filter((file) => fs.existsSync(file));

if (files.length === 0) {
  throw new Error("OpenNext produced no server bundles");
}

const violations = files.flatMap((file) => {
  const source = fs.readFileSync(file, "utf8");

  return FORBIDDEN_SOURCE.filter((needle) => source.includes(needle)).map(
    (needle) => `${path.relative(OPEN_NEXT, file)} contains ${needle}`,
  );
});

if (violations.length > 0) {
  throw new Error(
    `Cloudflare artifact is not Worker-safe:\n${violations.join("\n")}`,
  );
}

console.log(`Checked ${files.length} OpenNext server bundles.`);
