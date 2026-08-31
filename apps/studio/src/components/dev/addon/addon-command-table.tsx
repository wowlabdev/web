"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { Fragment, useMemo, useState } from "react";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@wowlab/shared/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@wowlab/shared/components/ui/table";
import { GitHubIcon } from "@wowlab/shared/lib/icons";
import { makeAddonRepoUrl } from "@wowlab/shared/lib/links";

import {
  type CommandGroup,
  type CommandRow,
  useAddonCommands,
} from "./use-addon-commands";

type FlatCommand = { group: string; terms: string } & CommandRow;

const SEARCH_KEYS = ["description", "terms"] as const;

export function AddonCommandTable() {
  const content = useIntlayer("addonPage");
  const [query, setQuery] = useState("");

  const commandGroups = useAddonCommands();

  const flatCommands = useMemo<FlatCommand[]>(
    () =>
      commandGroups.flatMap((group) =>
        group.commands.map((row) => ({
          ...row,
          group: group.title,
          terms: row.command.replace(/^\/wlab\s+/, ""),
        })),
      ),
    [commandGroups],
  );

  const matches = useFuzzySearch({
    items: flatCommands,
    keys: SEARCH_KEYS,
    query,
  });

  const visibleGroups = useMemo<CommandGroup[]>(() => {
    const byGroup = new Map<string, CommandRow[]>();

    for (const match of matches) {
      const list = byGroup.get(match.group) ?? [];

      list.push(match);
      byGroup.set(match.group, list);
    }

    return commandGroups
      .filter((group) => byGroup.has(group.title))
      .map((group) => ({
        commands: byGroup.get(group.title) ?? [],
        title: group.title,
      }));
  }, [commandGroups, matches]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold tracking-tight">
            {content.commandsTitle}
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {content.commandsDescription}
          </p>
        </div>
        <a
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          href={makeAddonRepoUrl()}
          rel="noreferrer"
          target="_blank"
        >
          <GitHubIcon className="size-3.5" />
          {content.commandsReferenceLabel}
        </a>
      </div>
      <InputGroup className="h-8 max-w-xs">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder={content.searchPlaceholder.value}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </InputGroup>
      <Card className="shadow-none">
        <CardContent className="p-0">
          {visibleGroups.length > 0 ? (
            <Table>
              <TableBody>
                {visibleGroups.map((group) => (
                  <Fragment key={group.title}>
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={2}
                        className="bg-muted/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {group.title}
                      </TableCell>
                    </TableRow>
                    {group.commands.map(({ command, description }) => (
                      <TableRow key={command}>
                        <TableCell className="px-4 py-2.5 align-baseline font-mono whitespace-normal text-foreground sm:w-[280px]">
                          {command}
                        </TableCell>
                        <TableCell className="px-4 py-2.5 align-baseline whitespace-normal text-muted-foreground">
                          {description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              {content.searchEmpty}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
