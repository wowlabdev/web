import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("checkoutPage", {
  // apps/studio/src/components/account/billing/checkout/inline-checkout.tsx, apps/studio/src/components/account/billing/checkout/order-summary.tsx
  "backToBilling": "Back to billing",
  "backToPlans": "Back to plans",
  "billingCycleDay": plural({ one: "Billed daily", other: "Billed every {{frequency}} days" }),
  "billingCycleMonth": plural({ one: "Billed monthly", other: "Billed every {{frequency}} months" }),
  "billingCycleWeek": plural({ one: "Billed weekly", other: "Billed every {{frequency}} weeks" }),
  "billingCycleYear": plural({ one: "Billed yearly", other: "Billed every {{frequency}} years" }),
  "decreaseQuantity": "Decrease quantity",
  "discount": "Discount",
  "increaseQuantity": "Increase quantity",
  "noItemSelected": "No item selected. Pick a plan or boost pack first.",
  "oneTimePayment": "One-time payment",
  "orderSummaryDescription": "Review and complete your purchase.",
  "orderSummaryTitle": "Order summary",
  "priceLabelBoostPack": "Boost pack",
  "priceLabelGuildSlots": "Guild slots",
  "priceLabelIndividualPlan": "Individual plan",
  "priceLabelPlan": "Plan",
  "quantity": "Quantity",
  "quantityInline": insert("Quantity: {{count}}"),
  "refundPolicyLink": "refund policy",
  "refundPolicyPrefix": "By checking out you waive the right of withdrawal. Subscriptions and boost packs are non-refundable. See our ",
  "refundPolicySuffix": ".",
  "tax": "Tax",
  "total": "Total",
  "trialPeriodDay": plural({ one: "{{frequency}} day", other: "{{frequency}} days" }),
  "trialPeriodMonth": plural({ one: "{{frequency}} month", other: "{{frequency}} months" }),
  "trialPeriodWeek": plural({ one: "{{frequency}} week", other: "{{frequency}} weeks" }),
  "trialPeriodYear": plural({ one: "{{frequency}} year", other: "{{frequency}} years" }),
  "trialSuffix": insert(" after {{trial}} free trial"),
  "viewPlans": "View plans",
});
