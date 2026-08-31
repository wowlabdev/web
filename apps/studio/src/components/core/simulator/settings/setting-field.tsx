"use client";

import { RotateCcw } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { Switch } from "@wowlab/shared/components/ui/switch";
import { cn } from "@wowlab/shared/lib/utils";

import {
  isOverridden,
  type SettingValue,
  type WasmSettingDef,
} from "./setting-types";

type SettingFieldProps = {
  onChange: (value: SettingValue) => void;
  onReset: () => void;
  setting: WasmSettingDef;
  value: SettingValue;
};

export function SettingField({
  onChange,
  onReset,
  setting,
  value,
}: Readonly<SettingFieldProps>) {
  const content = useIntlayer("simulatorPage");
  const overridden = isOverridden(setting, value);
  const kind = setting.kind;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label className={cn(overridden && "text-primary")}>
          {setting.label}
        </Label>
        {overridden && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onReset}
            title={content.resetToDefault.value}
          >
            <RotateCcw />
          </Button>
        )}
      </div>

      {kind.type === "bool" && (
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => onChange(checked)}
        />
      )}

      {(kind.type === "int" || kind.type === "float") && (
        <Input
          type="number"
          value={value as number}
          min={"min" in kind ? kind.min : undefined}
          max={"max" in kind ? kind.max : undefined}
          step={kind.type === "float" ? 0.1 : 1}
          onChange={(e) => {
            const parsed =
              kind.type === "float"
                ? Number.parseFloat(e.target.value)
                : Number.parseInt(e.target.value, 10);

            if (!Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
        />
      )}

      {kind.type === "enum" && (
        <Select value={value as string} onValueChange={(v) => onChange(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {kind.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {setting.description && (
        <p className="text-xs text-muted-foreground">{setting.description}</p>
      )}
    </div>
  );
}
