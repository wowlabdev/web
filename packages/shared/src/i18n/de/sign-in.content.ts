import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("signIn", {
  // apps/studio/src/components/account/auth/email-otp-request-step.tsx, apps/studio/src/components/account/auth/email-otp-verify-step.tsx, apps/studio/src/components/account/auth/email-otp-view.tsx +6 more
  "agreement": insert("Mit der Anmeldung stimmst du unseren {{terms}} und {{privacy}} zu."),
  "back": "Zurück",
  "changeEmail": "Andere E-Mail verwenden",
  "codeInstructions": insert("Gib den 8-stelligen Code ein, den wir an {{email}} gesendet haben."),
  "continueWithProvider": insert("Weiter mit {{provider}}"),
  "description": "Wähle wie du dich einloggen möchtest.",
  "emailFallbackTrigger": "Geht das nicht? Code per E-Mail senden",
  "emailLabel": "E-Mail-Adresse",
  "emailPlaceholder": "du@beispiel.com",
  "emailRecommendation": "Ein Anbieter ist schneller und sicherer. Geh lieber zurück.",
  "emailTitle": "Mit E-Mail anmelden",
  "otpError": "Dieser Code hat nicht funktioniert. Fordere einen neuen an und versuche es erneut.",
  "privacyPolicy": "Datenschutzrichtlinie",
  "secureAuth": "Sichere Authentifizierung",
  "sendCode": "Code per E-Mail senden",
  "sendError": "Wir konnten den Code nicht senden. Prüfe die Adresse und versuche es erneut.",
  "termsOfService": "Nutzungsbedingungen",
  "title": "Bei WoW Lab anmelden",
  "verifyCode": "Bestätigen und anmelden",
});
