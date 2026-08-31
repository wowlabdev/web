"use client";

import type { PermutationSpace, Profile } from "wowlab-common";

import { useMemoizedFn } from "ahooks";

import { useSubmitBibJob, useSubmitJob } from "@/lib/query/services/jobs";

export function useJobSubmission(
  profile: Profile | null,
  space: PermutationSpace | null,
  hasContestedSlots: boolean,
) {
  const {
    canSubmit: canSubmitQuick,
    isSubmitting: isSubmittingQuick,
    submit: submitQuick,
    submitError: quickError,
  } = useSubmitJob();
  const {
    canSubmit: canSubmitBib,
    isSubmitting: isSubmittingBib,
    submit: submitBib,
    submitError: bibError,
  } = useSubmitBibJob();

  const isSubmitting = isSubmittingBib || isSubmittingQuick;
  const canSubmit = hasContestedSlots ? canSubmitBib : canSubmitQuick;
  const submitError = bibError ?? quickError;

  const submit = useMemoizedFn(() => {
    if (!profile) {
      return;
    }

    if (hasContestedSlots && space) {
      submitBib(profile, space);
    } else {
      submitQuick(profile);
    }
  });

  return { canSubmit, isSubmitting, submit, submitError };
}
