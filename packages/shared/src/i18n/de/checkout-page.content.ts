import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("checkoutPage", {
  // apps/studio/src/components/account/billing/checkout/inline-checkout.tsx, apps/studio/src/components/account/billing/checkout/order-summary.tsx
  "backToBilling": "Zurück zur Abrechnung",
  "backToPlans": "Zurück zu den Tarifen",
  "billingCycleDay": plural({ one: "Wird täglich abgerechnet", other: "Wird alle {{frequency}} Tage abgerechnet" }),
  "billingCycleMonth": plural({ one: "Wird monatlich abgerechnet", other: "Wird alle {{frequency}} Monate abgerechnet" }),
  "billingCycleWeek": plural({ one: "Wird wöchentlich abgerechnet", other: "Wird alle {{frequency}} Wochen abgerechnet" }),
  "billingCycleYear": plural({ one: "Wird jährlich abgerechnet", other: "Wird alle {{frequency}} Jahre abgerechnet" }),
  "decreaseQuantity": "Menge verringern",
  "discount": "Rabatt",
  "increaseQuantity": "Menge erhöhen",
  "noItemSelected": "Kein Artikel ausgewählt. Wähle zuerst einen Tarif oder ein Boost-Paket.",
  "oneTimePayment": "Einmalzahlung",
  "orderSummaryDescription": "Überprüfe und schließe deinen Kauf ab.",
  "orderSummaryTitle": "Bestellübersicht",
  "priceLabelBoostPack": "Boost-Paket",
  "priceLabelGuildSlots": "Gilden-Slots",
  "priceLabelIndividualPlan": "Individueller Tarif",
  "priceLabelPlan": "Tarif",
  "quantity": "Menge",
  "quantityInline": insert("Menge: {{count}}"),
  "refundPolicyLink": "Rückerstattungsrichtlinie",
  "refundPolicyPrefix": "Für kostenpflichtige Abonnements und Boost-Pakete gilt eine 30-tägige Geld-zurück-Garantie. Siehe unsere ",
  "refundPolicySuffix": ".",
  "tax": "Steuer",
  "total": "Gesamt",
  "trialPeriodDay": plural({ one: "{{frequency}} Tag", other: "{{frequency}} Tagen" }),
  "trialPeriodMonth": plural({ one: "{{frequency}} Monat", other: "{{frequency}} Monaten" }),
  "trialPeriodWeek": plural({ one: "{{frequency}} Woche", other: "{{frequency}} Wochen" }),
  "trialPeriodYear": plural({ one: "{{frequency}} Jahr", other: "{{frequency}} Jahren" }),
  "trialSuffix": insert(" nach {{trial}} kostenloser Testphase"),
  "viewPlans": "Tarife ansehen",
});
