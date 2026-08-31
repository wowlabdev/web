import { join } from "node:path";
import { $, fs } from "zx";

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF?.trim();
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const EMAILS_DIR = join(import.meta.dirname, "..");
const OUT_DIR = join(EMAILS_DIR, "out");

const templates = [
  {
    file: "confirmation.html",
    key: "confirmation",
    subject: "Confirm your email",
    variables: ["{{ .Token }}"],
  },
  {
    file: "email-change.html",
    key: "email_change",
    subject: "Confirm your new email",
    variables: [
      "{{ .ConfirmationURL }}",
      "{{ .Email }}",
      "{{ .NewEmail }}",
      "{{ .Token }}",
    ],
  },
  {
    file: "invite.html",
    key: "invite",
    subject: "You have been invited to WoW Lab",
    variables: ["{{ .ConfirmationURL }}"],
  },
  {
    file: "magic-link.html",
    key: "magic_link",
    subject: "Sign in to WoW Lab",
    variables: ["{{ .Token }}"],
  },
  {
    file: "reauthentication.html",
    key: "reauthentication",
    subject: "Your WoW Lab verification code",
    variables: ["{{ .Token }}"],
  },
  {
    file: "recovery.html",
    key: "recovery",
    subject: "Reset your WoW Lab password",
    variables: ["{{ .ConfirmationURL }}", "{{ .Token }}"],
  },
] as const;

if (!ACCESS_TOKEN) {
  throw new Error(
    "Set SUPABASE_ACCESS_TOKEN to a Supabase personal access token.",
  );
}

if (!PROJECT_REF) {
  throw new Error("Set SUPABASE_PROJECT_REF to the project to update.");
}

if (!/^[a-z0-9]{20}$/.test(PROJECT_REF)) {
  throw new Error("SUPABASE_PROJECT_REF must be a 20-character project ref.");
}

await $({ cwd: EMAILS_DIR, quiet: true })`pnpm export`;

const body: Record<string, string> = {};

for (const { file, key, subject, variables } of templates) {
  const html = await fs.readFile(join(OUT_DIR, file), "utf8");

  for (const variable of variables) {
    if (!html.includes(variable)) {
      throw new Error(`${file} is missing ${variable}.`);
    }
  }

  body[`mailer_templates_${key}_content`] = html;
  body[`mailer_subjects_${key}`] = subject;
}

const response = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
  {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    signal: AbortSignal.timeout(30_000),
  },
);

if (!response.ok) {
  throw new Error(`Supabase API ${response.status}: ${await response.text()}`);
}

console.log(`Deployed ${templates.length} email templates to ${PROJECT_REF}.`);
