"use client";

import type { ActionEntry } from "../types";

import { CastFields } from "./cast-fields";
import { ItemFields } from "./item-fields";
import { ListFields } from "./list-fields";
import { ModifyVarFields } from "./modify-var-fields";
import { PoolFields } from "./pool-fields";
import { SetVarFields } from "./set-var-fields";
import { TrinketFields } from "./trinket-fields";
import { WaitFields } from "./wait-fields";

type ActionFieldsEditorProps = {
  draft: ActionEntry;
  onChange: (patch: Partial<ActionEntry>) => void;
  listNames: string[];
  spellSlugs: string[];
};

export function ActionFieldsEditor({
  draft,
  listNames,
  onChange,
  spellSlugs,
}: Readonly<ActionFieldsEditorProps>) {
  switch (draft.type) {
    case "call":
    case "run": {
      return (
        <ListFields draft={draft} onChange={onChange} listNames={listNames} />
      );
    }

    case "cast": {
      return (
        <CastFields draft={draft} onChange={onChange} spellSlugs={spellSlugs} />
      );
    }

    case "modify_var": {
      return <ModifyVarFields draft={draft} onChange={onChange} />;
    }

    case "pool": {
      return <PoolFields draft={draft} onChange={onChange} />;
    }

    case "set_var": {
      return <SetVarFields draft={draft} onChange={onChange} />;
    }

    case "use_item": {
      return <ItemFields draft={draft} onChange={onChange} />;
    }

    case "use_trinket": {
      return <TrinketFields draft={draft} onChange={onChange} />;
    }

    case "wait": {
      return <WaitFields draft={draft} onChange={onChange} />;
    }

    case "wait_until": {
      return null;
    }

    default: {
      return null;
    }
  }
}
