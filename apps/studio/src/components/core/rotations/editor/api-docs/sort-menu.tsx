"use client";

import { useMemoizedFn } from "ahooks";
import { ArrowUpDownIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";

import type { FieldSort } from "./descriptions";

type SortMenuProps = {
  onChange: (v: FieldSort) => void;
  value: FieldSort;
};

export function SortMenu({ onChange, value }: Readonly<SortMenuProps>) {
  const content = useIntlayer("rotationEditor");
  const handleValueChange = useMemoizedFn((next: string) => {
    onChange(next === "type" ? "type" : "alpha");
  });
  const sortLabel =
    value === "type" ? content.apiSortType.value : content.apiSortAlpha.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDownIcon />
          <span className="hidden md:inline">{sortLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{content.apiSortMenuTitle}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={handleValueChange}>
          <DropdownMenuRadioItem value="alpha">
            {content.apiSortAlpha}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="type">
            {content.apiSortType}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
