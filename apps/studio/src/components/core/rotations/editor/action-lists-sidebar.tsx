"use client";

import { ListPlusIcon, TrashIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@wowlab/shared/components/ui/input-group";
import { cn } from "@wowlab/shared/lib/utils";

import type { EditorScript } from "./store-types";

type ActionListsSidebarProps = {
  activeList: string | undefined;
  lists: EditorScript["lists"];
  onAddList: (name: string) => void;
  onRemoveList: (name: string) => void;
  onSelectList: (name: string) => void;
};

export function ActionListsSidebar({
  activeList,
  lists,
  onAddList,
  onRemoveList,
  onSelectList,
}: Readonly<ActionListsSidebarProps>) {
  const content = useIntlayer("rotationEditor");
  const [newListName, setNewListName] = useState("");
  const listNames = Object.keys(lists);

  const handleAddList = () => {
    const name = newListName.trim();

    if (!name) {
      return;
    }

    onAddList(name);
    setNewListName("");
  };

  return (
    <div className="space-y-2 lg:w-48 lg:shrink-0">
      <span className="text-xs font-medium text-muted-foreground">
        {content.actionListsTitle}
      </span>
      <div className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {listNames.map((name) => (
          <div
            key={name}
            className="flex shrink-0 items-center gap-1 lg:shrink"
          >
            <button
              type="button"
              onClick={() => onSelectList(name)}
              className={cn(
                "flex-1 rounded-none px-2 py-1.5 text-left text-xs transition-colors",
                activeList === name
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              {name}
              <span className="ml-1 opacity-50">({lists[name].length})</span>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6 shrink-0 text-muted-foreground hover:text-destructive lg:opacity-0 lg:[div:hover>&]:opacity-100"
              onClick={() => onRemoveList(name)}
            >
              <TrashIcon className="size-3" />
            </Button>
          </div>
        ))}
      </div>
      <InputGroup className="pt-1">
        <InputGroupInput
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder={content.newListPlaceholder.value}
          onKeyDown={(e) => e.key === "Enter" && handleAddList()}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={handleAddList}
            aria-label={content.addListAriaLabel.value}
          >
            <ListPlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
