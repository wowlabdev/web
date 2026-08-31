"use client";

import { useIntlayer } from "next-intlayer";

export function useStatNames(): Record<number, string> {
  const content = useIntlayer("gameComponents");

  return {
    0: content.statMana.value,
    1: content.statHealth.value,
    3: content.statAgility.value,
    32: content.statCriticalStrike.value,
    35: content.statResilience.value,
    36: content.statHaste.value,
    37: content.statExpertise.value,
    4: content.statStrength.value,
    40: content.statVersatility.value,
    49: content.statMastery.value,
    5: content.statIntellect.value,
    57: content.statPvpPower.value,
    6: content.statSpirit.value,
    61: content.statVersatility.value,
    7: content.statStamina.value,
    71: content.statAgilityOrStrengthOrIntellect.value,
    72: content.statAgilityOrStrength.value,
    73: content.statAgilityOrIntellect.value,
    74: content.statStrengthOrIntellect.value,
    91: content.statAvoidance.value,
    93: content.statLeech.value,
    94: content.statSpeed.value,
  };
}
