import { env } from "@wowlab/shared/lib/env";

import { PRICE_LABELS } from "./constants";

export function describeBillingItems(
  items: { priceId: string; quantity: number }[],
): string {
  const parts: string[] = [];

  for (const item of items) {
    const label = PRICE_LABELS[item.priceId];

    if (!label) {
      continue;
    }

    switch (item.priceId) {
      case env.PADDLE_PRICE_BOOST_PACK: {
        parts.push(`${item.quantity} boosts`);

        break;
      }

      case env.PADDLE_PRICE_GUILD_SLOT: {
        parts.push(`Guild (${item.quantity} slots)`);

        break;
      }

      case env.PADDLE_PRICE_INDIVIDUAL: {
        parts.push("Individual");

        break;
      }

      default: {
        parts.push(label);
      }
    }
  }

  return parts.join(", ");
}
