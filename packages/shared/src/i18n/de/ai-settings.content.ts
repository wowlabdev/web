import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("aiSettings", {
  // apps/studio/src/components/account/settings/ai-current-provider.tsx, apps/studio/src/components/account/settings/ai-model-selector.tsx, apps/studio/src/components/account/settings/ai-settings.tsx +1 more
  "apiKeyLabel": "API-Schlüssel",
  "apiKeyPlaceholder": "Füge deinen API-Schlüssel des Anbieters ein",
  "apiKeyPlaceholderSet": "Ein Schlüssel ist gespeichert. Füge einen neuen ein, um ihn zu ersetzen.",
  "invalidKey": "Dieser Schlüssel wurde nicht bestätigt. Prüfe ihn und versuche es erneut.",
  "keySetBadge": "Schlüssel gesetzt",
  "modelContextLabel": insert("{{tokens}} Kontext"),
  "modelEmpty": "Keine Modelle gefunden.",
  "modelLabel": "Modell",
  "modelPlaceholder": "Modell auswählen",
  "modelPriceLabel": insert("${{price}}/M"),
  "modelSearchPlaceholder": "Modelle suchen...",
  "providerAnthropic": "Anthropic",
  "providerLabel": "Anbieter",
  "providerOpenai": "OpenAI",
  "providerOpenrouter": "OpenRouter",
  "removeAriaLabel": "KI-Schlüssel entfernen",
  "saveButton": "Speichern",
  "saveError": "Deine Einstellungen konnten nicht gespeichert werden. Versuche es erneut.",
  "saveErrorTitle": "Speichern fehlgeschlagen",
  "sectionDescription": "Nutze deinen eigenen OpenAI-, Anthropic- oder OpenRouter-Schlüssel für den Rotations-Assistenten. Dein Schlüssel wird verschlüsselt und nie wieder angezeigt.",
  "sectionTitle": "KI-Assistent",
  "validateButton": "Bestätigen",
  "validKey": "Schlüssel ist gültig. Wähle ein Modell und speichere.",
  "validKeyCredits": insert("Schlüssel ist gültig. Guthaben: {{credits}}. Wähle ein Modell und speichere."),
});
