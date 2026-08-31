"use client";

import { useForm } from "@tanstack/react-form";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";
import { z } from "zod";

import type { McpServerInput } from "@/lib/ai/mcp-server";

import { withOptionalHeader } from "@/lib/ai/mcp-server";
import { parseMcpAddCommand } from "@/lib/ai/parse-mcp-command";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";

// Locale-independent bash command, intentionally not run through i18n.
const QUICK_ADD_EXAMPLE =
  'claude mcp add --transport http my-server https://example.com/mcp --header "Authorization: Bearer token"';

const FIELDS = [
  { labelKey: "labelLabel", name: "label", placeholderKey: "labelPlaceholder" },
  { labelKey: "urlLabel", name: "url", placeholderKey: "urlPlaceholder" },
  {
    labelKey: "headerNameLabel",
    name: "headerName",
    placeholderKey: "headerNamePlaceholder",
  },
  {
    labelKey: "headerValueLabel",
    name: "headerValue",
    placeholderKey: "headerValuePlaceholder",
    secret: true,
  },
] as const;

type AiMcpAddServerProps = {
  isPending: boolean;
  onAdd: (server: McpServerInput) => Promise<void>;
};

export function AiMcpAddServer({
  isPending,
  onAdd,
}: Readonly<AiMcpAddServerProps>) {
  const content = useIntlayer("aiMcp");
  const [quickAdd, setQuickAdd] = useState("");
  const [parsed, setParsed] = useState(false);

  const form = useForm({
    defaultValues: { headerName: "", headerValue: "", label: "", url: "" },
    onSubmit: async ({ value }) => {
      await onAdd(
        withOptionalHeader(
          { label: value.label.trim(), url: value.url.trim() },
          value.headerName.trim(),
          value.headerValue.trim(),
        ),
      );
      form.reset();
      setQuickAdd("");
      setParsed(false);
    },
    validators: {
      onChange: z.object({
        headerName: z.string(),
        headerValue: z.string(),
        label: z.string().trim().min(1),
        url: z.string().trim().pipe(z.url()),
      }),
    },
  });

  const onQuickAddChange = (value: string) => {
    setQuickAdd(value);

    const result = parseMcpAddCommand(value);

    if (result) {
      form.setFieldValue("label", result.label);
      form.setFieldValue("url", result.url);
      form.setFieldValue("headerName", result.headerName ?? "");
      form.setFieldValue("headerValue", result.headerValue ?? "");
    }

    setParsed(!!result);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <Field className="sm:col-span-2">
        <FieldLabel htmlFor="mcp-quick-add">
          {content.quickAddLabel}
          {parsed && (
            <span className="text-primary inline-flex items-center gap-1 text-xs font-normal">
              <CheckIcon className="size-3.5" />
              {content.quickAddParsed}
            </span>
          )}
        </FieldLabel>
        <Input
          id="mcp-quick-add"
          className="font-mono text-xs"
          placeholder={QUICK_ADD_EXAMPLE}
          value={quickAdd}
          onChange={(event) => onQuickAddChange(event.target.value)}
        />
        <FieldDescription>{content.quickAddHint}</FieldDescription>
      </Field>

      {FIELDS.map((entry) => (
        <form.Field key={entry.name} name={entry.name}>
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor={field.name}>
                {content[entry.labelKey]}
              </FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type={"secret" in entry ? "password" : "text"}
                autoComplete={"secret" in entry ? "off" : undefined}
                placeholder={content[entry.placeholderKey].value}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>
      ))}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" disabled={!canSubmit || isPending}>
              <PlusIcon className="size-4" />
              {content.addButton}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
