"use client";

import type { Action } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

export function useActionTypeLabels(): Record<Action["type"], string> {
  const content = useIntlayer("rotationEditor");

  return useMemo(
    () => ({
      call: content.actionTypeCall.value,
      cast: content.actionTypeCast.value,
      modify_var: content.actionTypeModifyVar.value,
      pool: content.actionTypePool.value,
      run: content.actionTypeRun.value,
      set_var: content.actionTypeSetVar.value,
      use_item: content.actionTypeUseItem.value,
      use_trinket: content.actionTypeUseTrinket.value,
      wait: content.actionTypeWait.value,
      wait_until: content.actionTypeWaitUntil.value,
    }),
    [content],
  );
}
