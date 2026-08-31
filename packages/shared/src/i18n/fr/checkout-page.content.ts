import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("checkoutPage", {
  // apps/studio/src/components/account/billing/checkout/inline-checkout.tsx, apps/studio/src/components/account/billing/checkout/order-summary.tsx
  "backToBilling": "Retour à la facturation",
  "backToPlans": "Retour aux plans",
  "billingCycleDay": plural({ one: "Facturation quotidienne", other: "Facturé tous les {{frequency}} jours" }),
  "billingCycleMonth": plural({ one: "Facturation mensuelle", other: "Facturé tous les {{frequency}} mois" }),
  "billingCycleWeek": plural({ one: "Facturation hebdomadaire", other: "Facturé toutes les {{frequency}} semaines" }),
  "billingCycleYear": plural({ one: "Facturation annuelle", other: "Facturé tous les {{frequency}} ans" }),
  "decreaseQuantity": "Diminuer la quantité",
  "discount": "Remise",
  "increaseQuantity": "Augmenter la quantité",
  "noItemSelected": "Aucun article sélectionné. Choisis d'abord un plan ou un pack de boosts.",
  "oneTimePayment": "Paiement unique",
  "orderSummaryDescription": "Vérifie et finalise ton achat.",
  "orderSummaryTitle": "Résumé de la commande",
  "priceLabelBoostPack": "Pack de boosts",
  "priceLabelGuildSlots": "Slots de guilde",
  "priceLabelIndividualPlan": "Plan individuel",
  "priceLabelPlan": "Plan",
  "quantity": "Quantité",
  "quantityInline": insert("Quantité : {{count}}"),
  "refundPolicyLink": "politique de remboursement",
  "refundPolicyPrefix": "En validant ta commande, tu renonces au droit de rétractation. Les abonnements et les packs de boosts ne sont pas remboursables. Voir notre ",
  "refundPolicySuffix": ".",
  "tax": "Taxe",
  "total": "Total",
  "trialPeriodDay": plural({ one: "{{frequency}} jour", other: "{{frequency}} jours" }),
  "trialPeriodMonth": plural({ one: "{{frequency}} mois", other: "{{frequency}} mois" }),
  "trialPeriodWeek": plural({ one: "{{frequency}} semaine", other: "{{frequency}} semaines" }),
  "trialPeriodYear": plural({ one: "{{frequency}} an", other: "{{frequency}} ans" }),
  "trialSuffix": insert(" après {{trial}} d'essai gratuit"),
  "viewPlans": "Voir les plans",
});
