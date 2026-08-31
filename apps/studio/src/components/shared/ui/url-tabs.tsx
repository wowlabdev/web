"use client";

import type { ComponentProps } from "react";

import { useQueryState } from "nuqs";

import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import { Tabs } from "@wowlab/shared/components/ui/tabs";

type UrlTabsControlledProps = {
  defaultValue?: never;
  onValueChange: (value: string) => void;
  queryKey?: never;
  value: string;
} & UrlTabsRootProps;

type UrlTabsProps = UrlTabsControlledProps | UrlTabsQueryProps;

type UrlTabsQueryProps = {
  defaultValue: string;
  onValueChange?: never;
  queryKey: string;
  value?: never;
} & UrlTabsRootProps;

type UrlTabsRootProps = Omit<
  ComponentProps<typeof Tabs>,
  "defaultValue" | "onValueChange" | "value"
>;

export function UrlTabs(props: UrlTabsProps) {
  if (props.queryKey !== undefined) {
    const { defaultValue, queryKey, ...rootProps } = props;

    return (
      <NuqsIsland
        fallback={<Tabs defaultValue={defaultValue} {...rootProps} />}
      >
        <UrlTabsQuery
          queryKey={queryKey}
          defaultValue={defaultValue}
          {...rootProps}
        />
      </NuqsIsland>
    );
  }

  const { onValueChange, value, ...rootProps } = props;

  return <Tabs value={value} onValueChange={onValueChange} {...rootProps} />;
}

function UrlTabsQuery({ defaultValue, queryKey, ...props }: UrlTabsQueryProps) {
  const [value, setValue] = useQueryState(queryKey, {
    defaultValue,
    history: "replace",
    shallow: false,
  });

  return <Tabs value={value} onValueChange={setValue} {...props} />;
}
