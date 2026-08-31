"use client";

import { useIntlayer } from "next-intlayer";

import {
  useDeletePaperdoll,
  usePaperdolls,
  useUpsertPaperdoll,
} from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { ImportPaperdollCard } from "./import-paperdoll-card";
import { PaperdollsTableCard } from "./paperdolls-table-card";

export function AdminPaperdollsPage() {
  const content = useIntlayer("admin");
  const paperdollsQuery = usePaperdolls();
  const upsert = useUpsertPaperdoll();
  const deletePaperdoll = useDeletePaperdoll();

  async function handleSave({
    characterName,
    simc,
    specId,
  }: {
    characterName: string;
    simc: string;
    specId: number;
  }) {
    await upsert.mutateAsync({
      p_character_name: characterName,
      p_simc: simc,
      p_spec_id: specId,
    });
  }

  async function handleDelete(specId: number) {
    await deletePaperdoll.mutateAsync(specId);
  }

  return (
    <div className="space-y-6">
      {(upsert.error || deletePaperdoll.error) && (
        <Alert variant="destructive">
          <AlertTitle>{content.paperdolls.requestFailed}</AlertTitle>
          <AlertDescription>
            {(upsert.error ?? deletePaperdoll.error)?.message}
          </AlertDescription>
        </Alert>
      )}

      <ImportPaperdollCard isPending={upsert.isPending} onSave={handleSave} />

      <PaperdollsTableCard
        data={paperdollsQuery.data}
        isDeletePending={deletePaperdoll.isPending}
        isFetching={paperdollsQuery.isFetching}
        onDelete={handleDelete}
      />
    </div>
  );
}
