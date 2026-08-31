import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("goExternal", {
  // apps/landing/src/components/go/external-warning.tsx
  "description": "Dieser Kurzlink verweist auf eine externe Domain. Bitte stelle sicher, dass du ihr vertraust, bevor du fortfährst.",
  "destination": "Ziel",
  "goBack": "Zurück",
  "host": insert("Host: {{host}}"),
  "redirectingIn": plural({ one: "Weiterleitung in {{count}} Sekunde", other: "Weiterleitung in {{count}} Sekunden" }),
  "redirectNow": "Jetzt weiterleiten",
  "title": "Du verlässt WoW Lab",
});
