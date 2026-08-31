"use client";

import { useDebounce, useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";

import type { FieldDescriptorInfo } from "../types";

import {
  ACTIONS_CATEGORY,
  DOMAIN_PREFIX,
  OPERATORS_CATEGORY,
} from "./constants";
import {
  ACTION_DESCRIPTION_KEY,
  type FieldSort,
  OPERATOR_DESCRIPTION_KEY,
} from "./descriptions";
import { buildDomainList, groupFieldsByDomain } from "./field-grouping";
import {
  API_ACTIONS,
  API_OPERATORS,
  type ApiActionEntry,
  type ApiOperatorEntry,
} from "./operator-catalog";
import { formatDomainLabel } from "./snippets";

export type CategoryWithMatches = { matches: number } & Category;

type Category = {
  count: number;
  id: string;
  kind: "actions" | "domain" | "operators";
  label: string;
};

type SearchableAction = { action: ApiActionEntry; searchText: string };
type SearchableField = { descriptor: FieldDescriptorInfo; searchText: string };
type SearchableOperator = { operator: ApiOperatorEntry; searchText: string };

type UseApiDocsStateInput = {
  auraSlugs: string[];
  descriptors: FieldDescriptorInfo[];
  resourceNames: string[];
  spellSlugs: string[];
};

const FUZZY_KEYS = ["searchText"] as const;
const FUZZY_LIMIT = 200;
const SEARCH_DEBOUNCE_MS = 150;

export function useApiDocsState({
  auraSlugs,
  descriptors,
  resourceNames,
  spellSlugs,
}: UseApiDocsStateInput) {
  const content = useIntlayer("rotationEditor");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, { wait: SEARCH_DEBOUNCE_MS });
  const isSearching = debouncedQuery.trim().length > 0;

  const [sortRaw, setSortRaw] = useQueryState(
    "apiSort",
    parseAsString.withDefault("alpha"),
  );
  const sort: FieldSort = sortRaw === "type" ? "type" : "alpha";

  const setSort = useMemoizedFn((value: FieldSort) => {
    void setSortRaw(value, { shallow: true });
  });

  const operatorDescription = useMemoizedFn(
    (op: ApiOperatorEntry) => content[OPERATOR_DESCRIPTION_KEY[op.id]].value,
  );
  const actionDescription = useMemoizedFn(
    (action: ApiActionEntry) =>
      content[ACTION_DESCRIPTION_KEY[action.id]].value,
  );

  const searchableFields = useMemo<SearchableField[]>(
    () =>
      descriptors.map((descriptor) => ({
        descriptor,
        searchText: `${descriptor.domain}.${descriptor.name} ${descriptor.description}`,
      })),
    [descriptors],
  );

  const searchableOperators = useMemo<SearchableOperator[]>(
    () =>
      API_OPERATORS.map((operator) => ({
        operator,
        searchText: `${operator.id} ${operator.symbol} ${
          content[OPERATOR_DESCRIPTION_KEY[operator.id]].value
        }`,
      })),
    [content],
  );

  const searchableActions = useMemo<SearchableAction[]>(
    () =>
      API_ACTIONS.map((action) => ({
        action,
        searchText: `${action.id} ${
          content[ACTION_DESCRIPTION_KEY[action.id]].value
        }`,
      })),
    [content],
  );

  const fieldResults = useFuzzySearch({
    items: searchableFields,
    keys: FUZZY_KEYS,
    limit: FUZZY_LIMIT,
    query: debouncedQuery,
  });

  const operatorResults = useFuzzySearch({
    items: searchableOperators,
    keys: FUZZY_KEYS,
    limit: FUZZY_LIMIT,
    query: debouncedQuery,
  });

  const actionResults = useFuzzySearch({
    items: searchableActions,
    keys: FUZZY_KEYS,
    limit: FUZZY_LIMIT,
    query: debouncedQuery,
  });

  const domainList = useMemo(() => buildDomainList(descriptors), [descriptors]);

  const categories: Category[] = useMemo(() => {
    const domainCategories: Category[] = domainList.map(
      ({ count, domain }) => ({
        count,
        id: `${DOMAIN_PREFIX}${domain}`,
        kind: "domain",
        label: formatDomainLabel(domain),
      }),
    );

    return [
      ...domainCategories,
      {
        count: API_OPERATORS.length,
        id: OPERATORS_CATEGORY,
        kind: "operators",
        label: content.apiCategoryOperators.value,
      },
      {
        count: API_ACTIONS.length,
        id: ACTIONS_CATEGORY,
        kind: "actions",
        label: content.apiCategoryActions.value,
      },
    ];
  }, [content, domainList]);

  const defaultCategory = categories[0]?.id ?? OPERATORS_CATEGORY;
  const [activeCategory, setActiveCategory] = useQueryState(
    "apiCat",
    parseAsString.withDefault(defaultCategory),
  );

  const visibleFieldsByDomain = useMemo(
    () =>
      groupFieldsByDomain(
        fieldResults.map((entry) => entry.descriptor),
        isSearching,
        sort,
      ),
    [fieldResults, isSearching, sort],
  );

  const visibleOperators = useMemo(
    () => operatorResults.map((entry) => entry.operator),
    [operatorResults],
  );

  const visibleActions = useMemo(
    () => actionResults.map((entry) => entry.action),
    [actionResults],
  );

  const exampleKeysFor = useMemoizedFn((d: FieldDescriptorInfo): string[] => {
    if (d.key_domain === "spell") {
      return spellSlugs;
    }

    if (d.key_domain === "aura") {
      return auraSlugs;
    }

    if (d.key_domain === "resource") {
      return resourceNames;
    }

    return [];
  });

  const categoryWithMatchCount = useMemo<CategoryWithMatches[]>(() => {
    return categories.map((c) => {
      let matches = c.count;

      if (isSearching) {
        if (c.kind === "domain") {
          const domain = c.id.slice(DOMAIN_PREFIX.length);

          matches = visibleFieldsByDomain.get(domain)?.length ?? 0;
        } else if (c.kind === "operators") {
          matches = visibleOperators.length;
        } else {
          matches = visibleActions.length;
        }
      }

      return { ...c, matches };
    });
  }, [
    categories,
    isSearching,
    visibleActions.length,
    visibleFieldsByDomain,
    visibleOperators.length,
  ]);

  const effectiveCategory = useMemo(() => {
    const isValid = categoryWithMatchCount.some((c) => c.id === activeCategory);

    if (isValid) {
      return activeCategory;
    }

    return defaultCategory;
  }, [activeCategory, categoryWithMatchCount, defaultCategory]);

  const activeMeta = categoryWithMatchCount.find(
    (c) => c.id === effectiveCategory,
  );

  const handleSelectCategory = useMemoizedFn((id: string) => {
    void setActiveCategory(id, { shallow: true });
  });

  return {
    actionDescription,
    activeMeta,
    categoryWithMatchCount,
    effectiveCategory,
    exampleKeysFor,
    handleSelectCategory,
    isSearching,
    operatorDescription,
    query,
    setQuery,
    setSort,
    sort,
    visibleActions,
    visibleFieldsByDomain,
    visibleOperators,
  };
}
