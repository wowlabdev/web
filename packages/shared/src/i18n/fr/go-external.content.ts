import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("goExternal", {
  // apps/landing/src/components/go/external-warning.tsx
  "description": "Ce lien court pointe vers un domaine externe. Vérifie que tu lui fais confiance avant de continuer.",
  "destination": "Destination",
  "goBack": "Retour",
  "host": insert("Hôte : {{host}}"),
  "redirectingIn": plural({ one: "Redirection dans {{count}} seconde", other: "Redirection dans {{count}} secondes" }),
  "redirectNow": "Rediriger maintenant",
  "title": "Tu quittes WoW Lab",
});
