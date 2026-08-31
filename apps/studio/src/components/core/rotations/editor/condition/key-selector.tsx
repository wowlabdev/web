"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import { formatSlug } from "@/components/core/rotations/format-slug";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

type KeySelectorProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function KeySelector({
  onChange,
  options,
  value,
}: Readonly<KeySelectorProps>) {
  const content = useIntlayer("rotationEditor");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) {
      return options.slice(0, 50);
    }

    const lower = search.toLowerCase();

    return options.filter((o) => o.toLowerCase().includes(lower)).slice(0, 50);
  }, [options, search]);

  if (options.length <= 30) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="h-7 w-40 text-xs">
          <SelectValue placeholder={content.keySelectorPlaceholder.value} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {formatSlug(o)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSearch(e.target.value);
        }}
        onFocus={() => setSearch(value)}
        placeholder={content.keySelectorSlugPlaceholder.value}
        className="h-7 w-40 text-xs"
        list="cond-key-options"
      />
      <datalist id="cond-key-options">
        {filtered.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </>
  );
}
