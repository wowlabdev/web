"use client";

import { useForm } from "@tanstack/react-form";
import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import type { FleetUser } from "@/lib/query/services";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { Field, FieldLabel } from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { Switch } from "@wowlab/shared/components/ui/switch";

import { hoursFromNowToIso, parseTagsInput } from "./fleet-helpers";

type CreateKeyDialogProps = {
  isOpen: boolean;
  users: FleetUser[];
  isPending: boolean;
  onClose: () => void;
  onCreate: (input: {
    userId: string;
    reusable: boolean;
    ephemeral: boolean;
    expiration: string;
    aclTags: string[];
  }) => void;
};

export function CreateKeyDialog({
  isOpen,
  isPending,
  onClose,
  onCreate,
  users,
}: Readonly<CreateKeyDialogProps>) {
  const content = useIntlayer("admin");

  const form = useForm({
    defaultValues: {
      ephemeral: false,
      hours: 720,
      reusable: false,
      tags: "tag:node",
      userId: "",
    },
    onSubmit: ({ value }) => {
      onCreate({
        aclTags: parseTagsInput(value.tags),
        ephemeral: value.ephemeral,
        expiration: hoursFromNowToIso(String(value.hours)),
        reusable: value.reusable,
        userId: value.userId,
      });
    },
    validators: {
      onChange: z.object({
        ephemeral: z.boolean(),
        hours: z.number().min(1),
        reusable: z.boolean(),
        tags: z.string(),
        userId: z.string().min(1),
      }),
    },
  });

  const handleOpenChange = useMemoizedFn((next: boolean) => {
    if (next) {
      form.reset({
        ephemeral: false,
        hours: 720,
        reusable: false,
        tags: "tag:node",
        userId: users[0]?.id ?? "",
      });
    } else {
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.fleet.createKey}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="userId">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.user}
                </FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="reusable">
            {(field) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.reusable}
                </FieldLabel>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="ephemeral">
            {(field) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.ephemeral}
                </FieldLabel>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="hours">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  {content.fleet.expirationHours}
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.valueAsNumber)
                  }
                />
              </Field>
            )}
          </form.Field>

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
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {content.fleet.create}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
