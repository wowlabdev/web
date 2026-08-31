import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("aiSettings", {
  // apps/studio/src/components/account/settings/ai-current-provider.tsx, apps/studio/src/components/account/settings/ai-model-selector.tsx, apps/studio/src/components/account/settings/ai-settings.tsx +1 more
  "apiKeyLabel": "API key",
  "apiKeyPlaceholder": "Paste your provider API key",
  "apiKeyPlaceholderSet": "A key is saved. Paste a new one to replace it.",
  "invalidKey": "That key did not validate. Check it and try again.",
  "keySetBadge": "Key set",
  "modelContextLabel": insert("{{tokens}} ctx"),
  "modelEmpty": "No models found.",
  "modelLabel": "Model",
  "modelPlaceholder": "Select a model",
  "modelPriceLabel": insert("${{price}}/M"),
  "modelSearchPlaceholder": "Search models...",
  "providerAnthropic": "Anthropic",
  "providerLabel": "Provider",
  "providerOpenai": "OpenAI",
  "providerOpenrouter": "OpenRouter",
  "removeAriaLabel": "Remove AI key",
  "saveButton": "Save",
  "saveError": "Could not save your settings. Try again.",
  "saveErrorTitle": "Save failed",
  "sectionDescription": "Bring your own OpenAI, Anthropic, or OpenRouter key to use the rotation assistant. Your key is encrypted and never shown again.",
  "sectionTitle": "AI assistant",
  "validateButton": "Validate",
  "validKey": "Key is valid. Pick a model and save.",
  "validKeyCredits": insert("Key is valid. Credits: {{credits}}. Pick a model and save."),
});
