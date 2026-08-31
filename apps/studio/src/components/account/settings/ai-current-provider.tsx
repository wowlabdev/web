"use client";

import type { ComponentType, SVGProps } from "react";

import { KeyRoundIcon, Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";

type AiCurrentProviderProps = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  removing: boolean;
  onRemove: () => void;
};

export function AiCurrentProvider({
  icon: Icon,
  label,
  onRemove,
  removing,
}: Readonly<AiCurrentProviderProps>) {
  const content = useIntlayer("aiSettings");

  return (
    <Item variant="outline">
      <ItemMedia>
        <Icon className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
      <Badge variant="secondary">
        <KeyRoundIcon className="size-3" />
        {content.keySetBadge}
      </Badge>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={removing}
        aria-label={content.removeAriaLabel.value}
        onClick={onRemove}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </Item>
  );
}
