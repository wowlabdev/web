"use client";

import { useForm } from "@tanstack/react-form";
import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";

import type { FleetNode } from "@/lib/query/services";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { Field, FieldLabel } from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

import { parseTagsInput } from "./fleet-helpers";

type TagsDialogProps = {
  target: FleetNode | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (tags: string[]) => void;
};

export function TagsDialog({
  isPending,
  onClose,
  onSubmit,
  target,
}: Readonly<TagsDialogProps>) {
  const content = useIntlayer("admin");

  const form = useForm({
    defaultValues: { tags: "" },
    onSubmit: ({ value }) => {
      onSubmit(parseTagsInput(value.tags));
    },
  });

  const handleOpenChange = useMemoizedFn((next: boolean) => {
    if (next && target) {
      form.reset({ tags: target.tags.join(", ") });
    } else {
      onClose();
    }
  });

  return (
    <Dialog open={target !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.fleet.setTags}</DialogTitle>
          <DialogDescription>{content.fleet.tagsHelp}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="tags">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.tags}
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder={content.fleet.tagsPlaceholder.value}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {content.fleet.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {content.fleet.setTags}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
