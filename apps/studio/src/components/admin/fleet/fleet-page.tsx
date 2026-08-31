"use client";

import { useBoolean } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import {
  type FleetNode,
  useCreatePreAuthKey,
  useDeleteNode,
  useExpireNode,
  useExpirePreAuthKey,
  useFleet,
  useRenameNode,
  useSetNodeTags,
} from "@/lib/query/services";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { toast } from "@wowlab/shared/components/ui/sonner";

import { ClientsCard } from "./clients-card";
import { CreateKeyDialog } from "./create-key-dialog";
import { DeleteDialog } from "./delete-dialog";
import { ExpireDialog } from "./expire-dialog";
import { PreAuthKeysCard } from "./pre-auth-keys-card";
import { RenameDialog } from "./rename-dialog";
import { ShowKeyDialog } from "./show-key-dialog";
import { TagsDialog } from "./tags-dialog";

export function FleetPage() {
  const content = useIntlayer("admin");
  const fleet = useFleet();
  const rename = useRenameNode();
  const expire = useExpireNode();
  const setTags = useSetNodeTags();
  const del = useDeleteNode();
  const createKey = useCreatePreAuthKey();
  const expireKey = useExpirePreAuthKey();

  const [renameTarget, setRenameTarget] = useState<FleetNode | null>(null);
  const [tagsTarget, setTagsTarget] = useState<FleetNode | null>(null);
  const [expireTarget, setExpireTarget] = useState<FleetNode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FleetNode | null>(null);
  const [createOpen, { setFalse: closeCreate, setTrue: openCreate }] =
    useBoolean(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const pendingError =
    rename.error ??
    expire.error ??
    setTags.error ??
    del.error ??
    createKey.error ??
    expireKey.error ??
    (fleet.error as Error | null | undefined);

  return (
    <div className="space-y-6">
      {pendingError && (
        <Alert variant="destructive">
          <AlertTitle>{content.fleet.failed}</AlertTitle>
          <AlertDescription>{pendingError.message}</AlertDescription>
        </Alert>
      )}

      <ClientsCard
        data={fleet.data}
        isLoading={fleet.isLoading}
        onRename={setRenameTarget}
        onSetTags={setTagsTarget}
        onExpire={setExpireTarget}
        onDelete={setDeleteTarget}
      />

      <PreAuthKeysCard
        data={fleet.data}
        isLoading={fleet.isLoading}
        onCreate={openCreate}
        onExpireKey={(userId, key) => expireKey.mutate({ key, userId })}
      />

      <RenameDialog
        target={renameTarget}
        isPending={rename.isPending}
        onClose={() => setRenameTarget(null)}
        onSubmit={(newName) =>
          renameTarget &&
          rename.mutate(
            { id: renameTarget.id, newName },
            {
              onError: () => toast.error(content.fleet.renameFailed.value),
              onSuccess: () => {
                setRenameTarget(null);
                toast.success(content.fleet.renameSuccess.value);
              },
            },
          )
        }
      />

      <TagsDialog
        target={tagsTarget}
        isPending={setTags.isPending}
        onClose={() => setTagsTarget(null)}
        onSubmit={(tags) =>
          tagsTarget &&
          setTags.mutate(
            { id: tagsTarget.id, tags },
            { onSuccess: () => setTagsTarget(null) },
          )
        }
      />

      <ExpireDialog
        target={expireTarget}
        isPending={expire.isPending}
        onClose={() => setExpireTarget(null)}
        onConfirm={() =>
          expireTarget &&
          expire.mutate(expireTarget.id, {
            onSuccess: () => setExpireTarget(null),
          })
        }
      />

      <DeleteDialog
        target={deleteTarget}
        isPending={del.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget &&
          del.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
      />

      <CreateKeyDialog
        isOpen={createOpen}
        users={fleet.data?.users ?? []}
        isPending={createKey.isPending}
        onClose={closeCreate}
        onCreate={(input) =>
          createKey.mutate(input, {
            onSuccess: (result) => {
              closeCreate();
              setCreatedKey(result.preAuthKey.key);
            },
          })
        }
      />

      <ShowKeyDialog
        keyValue={createdKey}
        onClose={() => setCreatedKey(null)}
      />
    </div>
  );
}
