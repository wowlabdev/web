"use client";

import type { Spell } from "@wowlab/shared/lib/supabase/types";

import {
  buildAuraToml,
  buildSpellDiff,
  buildSpellToml,
  useManifestIndex,
} from "@/lib/game-data/inspect";
import { useResolvedSpecIntrospection } from "@/lib/query/services";
import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";

type SpellManifestPanelProps = {
  spell: Spell;
};

export function SpellManifestPanel({
  spell,
}: Readonly<SpellManifestPanelProps>) {
  const { data: index } = useManifestIndex();
  const refs = index?.byId.get(spell.id) ?? [];
  const primary = refs.find((ref) => ref.kind === "spell") ?? refs.at(0);

  const { data: resolved } = useResolvedSpecIntrospection(
    primary?.specId ?? null,
  );
  const info = resolved?.spells.find((s) => s.spell_id === spell.id) ?? null;
  const diff = info ? buildSpellDiff(spell, info) : [];

  const showAura =
    spell.duration > 0 || spell.is_passive || spell.max_stacks > 1;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manifest</h2>

      {refs.length === 0 ? (
        <Badge variant="secondary">Not implemented in any manifest</Badge>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm">
          {refs.map((ref) => (
            <div
              key={`${ref.specId}-${ref.kind}`}
              className="flex flex-wrap items-center gap-2"
            >
              <Badge variant={ref.kind === "spell" ? "default" : "outline"}>
                {ref.kind}
              </Badge>
              <code className="text-muted-foreground text-xs">{ref.slug}</code>
              <span className="text-muted-foreground">in</span>
              <span className="font-medium">{ref.specName}</span>
            </div>
          ))}
        </div>
      )}

      {diff.length > 0 && (
        <TableCard
          title="Game data vs manifest"
          data={diff}
          rowKey={(row) => row.label}
          columns={[
            { cell: (row) => row.label, header: "Field" },
            { cell: (row) => row.game, header: "Game" },
            { cell: (row) => row.manifest, header: "Manifest" },
            {
              cell: (row) => <MatchCell status={row.status} />,
              className: "text-end pr-6",
              header: "Match",
            },
          ]}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <TomlBlock
          title="Starter [spells] entry"
          value={buildSpellToml(spell)}
        />
        {showAura && (
          <TomlBlock
            title="Starter [auras] entry"
            value={buildAuraToml(spell)}
          />
        )}
      </div>
    </div>
  );
}

function MatchCell({
  status,
}: Readonly<{ status: "info" | "mismatch" | "ok" }>) {
  if (status === "ok") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-500/40 text-emerald-500"
      >
        match
      </Badge>
    );
  }

  if (status === "mismatch") {
    return <Badge variant="destructive">mismatch</Badge>;
  }

  return <span className="text-muted-foreground">n/a</span>;
}

function TomlBlock({
  title,
  value,
}: Readonly<{ title: string; value: string }>) {
  return (
    <div className="bg-muted/40 rounded-md border">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          {title}
        </span>
        <CopyButton value={value} />
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  );
}
