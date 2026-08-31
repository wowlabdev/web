"use client";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import {
  useAddReservedHandle,
  useDeleteReservedHandle,
  useReservedHandles,
} from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { AddHandleCard } from "./add-handle-card";
import { HandlesTableCard } from "./handles-table-card";

export function ReservedHandlesPage() {
  const content = useIntlayer("admin");
  const reservedHandlesQuery = useReservedHandles();
  const addHandle = useAddReservedHandle();
  const deleteHandle = useDeleteReservedHandle();
  const [page, setPage] = useState(1);

  async function handleAdd(handle: string, reason: string) {
    await addHandle.mutateAsync({ handle, reason });
    setPage(1);
  }

  async function handleDelete(value: string) {
    await deleteHandle.mutateAsync(value);
  }

  return (
    <div className="space-y-6">
      {(addHandle.error || deleteHandle.error) && (
        <Alert variant="destructive">
          <AlertTitle>{content.handles.requestFailed}</AlertTitle>
          <AlertDescription>
            {(addHandle.error ?? deleteHandle.error)?.message}
          </AlertDescription>
        </Alert>
      )}

      <AddHandleCard isPending={addHandle.isPending} onAdd={handleAdd} />

      <HandlesTableCard
        data={reservedHandlesQuery.data}
        isDeletePending={deleteHandle.isPending}
        isFetching={reservedHandlesQuery.isFetching}
        onDelete={handleDelete}
        onPageChange={setPage}
        page={page}
      />
    </div>
  );
}
