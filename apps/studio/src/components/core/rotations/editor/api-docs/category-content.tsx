"use client";

import { useIntlayer } from "next-intlayer";

import type { FieldDescriptorInfo } from "../types";
import type { ApiActionEntry, ApiOperatorEntry } from "./operator-catalog";

import { ActionList } from "./action-list";
import {
  ACTIONS_CATEGORY,
  DOMAIN_PREFIX,
  OPERATORS_CATEGORY,
} from "./constants";
import { EmptyResults } from "./empty-results";
import { FieldList } from "./field-list";
import { OperatorList } from "./operator-list";
type CategoryContentProps = {
  actionDescription: (a: ApiActionEntry) => string;
  activeCategory: string;
  activeLabel: string;
  activeMatches: number;
  exampleKeysFor: (d: FieldDescriptorInfo) => string[];
  isSearching: boolean;
  operatorDescription: (op: ApiOperatorEntry) => string;
  visibleActions: ApiActionEntry[];
  visibleFieldsByDomain: Map<string, FieldDescriptorInfo[]>;
  visibleOperators: ApiOperatorEntry[];
};

export function CategoryContent({
  actionDescription,
  activeCategory,
  activeLabel,
  activeMatches,
  exampleKeysFor,
  isSearching,
  operatorDescription,
  visibleActions,
  visibleFieldsByDomain,
  visibleOperators,
}: Readonly<CategoryContentProps>) {
  const content = useIntlayer("rotationEditor");
  const header = (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span className="font-medium">{activeLabel}</span>
      <span>
        {isSearching
          ? content.apiResultsCount(activeMatches).value
          : content.apiTotalCount(activeMatches).value}
      </span>
    </div>
  );

  if (activeCategory === OPERATORS_CATEGORY) {
    return (
      <div className="space-y-2">
        {header}
        {visibleOperators.length === 0 ? (
          <EmptyResults />
        ) : (
          <OperatorList
            describe={operatorDescription}
            operators={visibleOperators}
          />
        )}
      </div>
    );
  }

  if (activeCategory === ACTIONS_CATEGORY) {
    return (
      <div className="space-y-2">
        {header}
        {visibleActions.length === 0 ? (
          <EmptyResults />
        ) : (
          <ActionList actions={visibleActions} describe={actionDescription} />
        )}
      </div>
    );
  }

  const domain = activeCategory.startsWith(DOMAIN_PREFIX)
    ? activeCategory.slice(DOMAIN_PREFIX.length)
    : "";
  const fields = visibleFieldsByDomain.get(domain) ?? [];

  return (
    <div className="space-y-2">
      {header}
      {fields.length === 0 ? (
        <EmptyResults />
      ) : (
        <FieldList descriptors={fields} exampleKeysFor={exampleKeysFor} />
      )}
    </div>
  );
}
