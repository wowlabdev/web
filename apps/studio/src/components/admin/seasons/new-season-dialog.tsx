"use client";

import { useForm } from "@tanstack/react-form";
import { useBoolean } from "ahooks";
import { CalendarPlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wowlab/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

type NewSeasonDialogProps = {
  isPending: boolean;
  onCreate: (input: {
    newSeasonId: string;
    rulesetVersion: number;
    startsAt: string;
  }) => Promise<void>;
};

export function NewSeasonDialog({
  isPending,
  onCreate,
}: Readonly<NewSeasonDialogProps>) {
  const content = useIntlayer("admin");
  const [isOpen, { set: setOpen, setFalse: closeDialog }] = useBoolean(false);

  const form = useForm({
    defaultValues: { newSeasonId: "", rulesetVersion: "3", startsAt: "" },
    onSubmit: async ({ value }) => {
      await onCreate({
        newSeasonId: value.newSeasonId.trim(),
        rulesetVersion: Number(value.rulesetVersion),
        startsAt: new Date(value.startsAt).toISOString(),
      });

      closeDialog();
      form.reset();
    },
    validators: {
      onChange: z.object({
        newSeasonId: z.string().trim().min(1),
        rulesetVersion: z
          .string()
          .refine(
            (value) => value.trim() !== "" && Number.isInteger(Number(value)),
          ),
        startsAt: z.string().min(1),
      }),
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarPlusIcon className="size-4" />
          {content.seasons.newSeason}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.seasons.createAndActivate}</DialogTitle>
          <DialogDescription>{content.seasons.description}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-3"
        >
          <form.Field name="newSeasonId">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>
                  {content.seasons.seasonId}
                </FieldLabel>
                <Input
                  id={field.name}
                  placeholder={content.seasons.seasonIdPlaceholder.value}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Field name="rulesetVersion">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>
                  {content.seasons.rulesetVersion}
                </FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <form.Field name="startsAt">
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              >
                <FieldLabel htmlFor={field.name}>
                  {content.seasons.startDate}
                </FieldLabel>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              {content.seasons.cancel}
            </Button>
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending
                    ? content.seasons.creating
                    : content.seasons.createSeason}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
