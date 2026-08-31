import { $, argv, fs, glob, path } from "zx";

const root = path.resolve(import.meta.dirname, "../../..");
const arguments_ = argv.fix ? ["--fix"] : [];
const run = $({ cwd: root, stdio: "inherit" });

await run`eslint . ${arguments_}`;
await $({
  cwd: `${root}/supabase`,
  stdio: "inherit",
})`deno lint --config functions/ai/deno.json functions/ai functions/_shared ${arguments_}`;
await $({
  cwd: `${root}/supabase`,
  stdio: "inherit",
})`deno lint --config functions/icons/deno.json functions/icons ${arguments_}`;

const sourceFiles = await glob(
  "**/*.{c,cc,cpp,css,go,h,hpp,html,java,js,jsx,lua,md,mdx,mjs,mts,php,py,rs,scss,sh,sql,svelte,ts,tsx,vue}",
  { cwd: root, gitignore: true },
);

for (const sourceFile of sourceFiles) {
  const lines = (await fs.readFile(path.join(root, sourceFile), "utf8")).split(
    "\n",
  );
  let open: { line: number; name: string } | undefined;

  for (const [index, text] of lines.entries()) {
    const marker = /docref:(start|end)\s+(\S+)/.exec(text);

    if (!marker) {
      continue;
    }

    const [, kind, name] = marker;
    const line = index + 1;

    if (kind === "start") {
      if (open) {
        throw new Error(
          `${sourceFile}:${line}: docref ${name} starts before ${open.name} ends`,
        );
      }

      open = { line, name };
    } else if (!open || open.name !== name) {
      throw new Error(
        `${sourceFile}:${line}: docref ${name} has no matching start`,
      );
    } else {
      open = undefined;
    }
  }

  if (open) {
    throw new Error(
      `${sourceFile}:${open.line}: docref ${open.name} has no matching end`,
    );
  }
}
