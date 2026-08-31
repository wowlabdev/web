import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("goExternal", {
  // apps/landing/src/components/go/external-warning.tsx
  "description": "This short link points to an external domain. Please make sure you trust it before continuing.",
  "destination": "Destination",
  "goBack": "Go back",
  "host": insert("Host: {{host}}"),
  "redirectingIn": plural({ one: "Redirecting in {{count}} second", other: "Redirecting in {{count}} seconds" }),
  "redirectNow": "Redirect now",
  "title": "You are leaving WoW Lab",
});
