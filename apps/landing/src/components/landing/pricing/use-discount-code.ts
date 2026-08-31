"use client";

import { useQueryState } from "nuqs";

export function useDiscountCode() {
  return useQueryState("discount", { defaultValue: "" });
}
