"use client";

import { Search } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Input } from "@wowlab/shared/components/ui/input";

export function FilterBar({
  onChange,
  value,
}: Readonly<{ onChange: (value: string) => void; value: string }>) {
  const content = useIntlayer("hooksPage");

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        className="pl-9"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={content.filterPlaceholder.value}
      />
    </div>
  );
}
