"use client";

import { useBoolean } from "ahooks";
import { TagIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { NuqsIsland } from "@/components/islands/nuqs-island";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";

import { useDiscountCode } from "./use-discount-code";

export function DiscountInput() {
  return (
    <NuqsIsland fallback={<Skeleton className="h-8 w-36" />}>
      <DiscountInputInner />
    </NuqsIsland>
  );
}

function DiscountInputInner() {
  const content = useIntlayer("pricingPage");
  const [discountCode, setDiscountCode] = useDiscountCode();
  const [draft, setDraft] = useState("");
  const [expanded, { setTrue: expand }] = useBoolean(false);

  if (discountCode) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <TagIcon className="text-muted-foreground size-3.5" />
        <span className="text-muted-foreground">
          {content.discountLabel}{" "}
          <span className="font-medium">{discountCode}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => void setDiscountCode("")}
        >
          {content.discountRemove}
        </Button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground text-xs"
        onClick={expand}
      >
        <TagIcon className="size-3.5" />
        {content.discountToggle}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={content.discountCodePlaceholder.value}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="h-8 w-40 text-xs"
      />
      <Button
        size="sm"
        variant="outline"
        disabled={!draft.trim()}
        onClick={() => {
          void setDiscountCode(draft.trim());
          setDraft("");
        }}
      >
        {content.discountApply}
      </Button>
    </div>
  );
}
