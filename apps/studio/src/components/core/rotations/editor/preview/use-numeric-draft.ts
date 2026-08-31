"use client";

import { useMemoizedFn, useUpdateEffect } from "ahooks";
import { useState } from "react";

type UseNumericDraftOptions = {
  normalize: (n: number) => number | null;
  onChange: (next: number) => void;
  value: number;
};

type UseNumericDraftResult = {
  draft: string;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  setDraft: (raw: string) => void;
};

export function useNumericDraft({
  normalize,
  onChange,
  value,
}: UseNumericDraftOptions): UseNumericDraftResult {
  const [draft, setDraft] = useState(String(value));

  useUpdateEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- resync editable local draft when the committed prop value changes externally
    setDraft(String(value));
  }, [value]);

  const commit = useMemoizedFn(() => {
    const normalized = normalize(Number(draft));

    if (normalized === null || normalized === value) {
      setDraft(String(value));
    } else {
      onChange(normalized);
    }
  });

  const handleKeyDown = useMemoizedFn(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      } else if (event.key === "Escape") {
        setDraft(String(value));
        event.currentTarget.blur();
      }
    },
  );

  return { draft, handleKeyDown, onBlur: commit, setDraft };
}
