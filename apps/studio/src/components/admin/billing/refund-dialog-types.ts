export type RefundAction = "credit" | "refund";

export type RefundFormValues = {
  action: RefundAction;
  lineItems: RefundLineItemValue[];
  reason: string;
};

export type RefundLineItemValue = {
  amount: string;
  isSelected: boolean;
  type: RefundType;
};

export type RefundType = "full" | "partial";
