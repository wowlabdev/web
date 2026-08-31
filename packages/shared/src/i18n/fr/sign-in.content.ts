import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("signIn", {
  // apps/studio/src/components/account/auth/email-otp-request-step.tsx, apps/studio/src/components/account/auth/email-otp-verify-step.tsx, apps/studio/src/components/account/auth/email-otp-view.tsx +6 more
  "agreement": insert("En te connectant, tu acceptes nos {{terms}} et {{privacy}}."),
  "back": "Retour",
  "changeEmail": "Utiliser une autre adresse e-mail",
  "codeInstructions": insert("Saisis le code à 8 chiffres que nous avons envoyé à {{email}}."),
  "continueWithProvider": insert("Continuer avec {{provider}}"),
  "description": "Choisis comment te connecter.",
  "emailFallbackTrigger": "Impossible ? Recevoir un code par e-mail",
  "emailLabel": "Adresse e-mail",
  "emailPlaceholder": "toi@exemple.com",
  "emailRecommendation": "Un fournisseur est plus rapide et plus sûr. Reviens si possible.",
  "emailTitle": "Se connecter par e-mail",
  "otpError": "Ce code n'a pas fonctionné. Demandes-en un nouveau et réessaie.",
  "privacyPolicy": "Politique de confidentialité",
  "secureAuth": "Authentification sécurisée",
  "sendCode": "Recevoir un code par e-mail",
  "sendError": "Nous n'avons pas pu envoyer ce code. Vérifie l'adresse et réessaie.",
  "termsOfService": "Conditions d'utilisation",
  "title": "Se connecter à WoW Lab",
  "verifyCode": "Vérifier et se connecter",
});
