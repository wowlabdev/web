import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("aiSettings", {
  // apps/studio/src/components/account/settings/ai-current-provider.tsx, apps/studio/src/components/account/settings/ai-model-selector.tsx, apps/studio/src/components/account/settings/ai-settings.tsx +1 more
  "apiKeyLabel": "Clé API",
  "apiKeyPlaceholder": "Collez la clé API de votre fournisseur",
  "apiKeyPlaceholderSet": "Une clé est enregistrée. Collez-en une nouvelle pour la remplacer.",
  "invalidKey": "Cette clé n'a pas été validée. Vérifiez-la et réessayez.",
  "keySetBadge": "Clé définie",
  "modelContextLabel": insert("{{tokens}} ctx"),
  "modelEmpty": "Aucun modèle trouvé.",
  "modelLabel": "Modèle",
  "modelPlaceholder": "Choisir un modèle",
  "modelPriceLabel": insert("${{price}}/M"),
  "modelSearchPlaceholder": "Rechercher des modèles...",
  "providerAnthropic": "Anthropic",
  "providerLabel": "Fournisseur",
  "providerOpenai": "OpenAI",
  "providerOpenrouter": "OpenRouter",
  "removeAriaLabel": "Retirer la clé IA",
  "saveButton": "Enregistrer",
  "saveError": "Impossible d'enregistrer vos réglages. Réessayez.",
  "saveErrorTitle": "Échec de l'enregistrement",
  "sectionDescription": "Utilisez votre propre clé OpenAI, Anthropic ou OpenRouter pour l'assistant de rotation. Votre clé est chiffrée et n'est plus jamais affichée.",
  "sectionTitle": "Assistant IA",
  "validateButton": "Valider",
  "validKey": "La clé est valide. Choisissez un modèle et enregistrez.",
  "validKeyCredits": insert("La clé est valide. Crédits : {{credits}}. Choisissez un modèle et enregistrez."),
});
