"use client";

import { useForm } from "@tanstack/react-form";
import { useBoolean } from "ahooks";
import { Eye, Mail, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@wowlab/shared/components/ui/button";
import { Calendar } from "@wowlab/shared/components/ui/calendar";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { Combobox } from "@wowlab/shared/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@wowlab/shared/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@wowlab/shared/components/ui/input-otp";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { Slider } from "@wowlab/shared/components/ui/slider";
import { Switch } from "@wowlab/shared/components/ui/switch";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const;

export function FormsSection() {
  return (
    <DemoSection id="forms" title="Forms & Inputs">
      <InputDemo />
      <TextareaDemo />
      <InputGroupDemo />
      <InputOtpDemo />
      <LabelDemo />
      <CheckboxDemo />
      <ComboboxDemo />
      <SelectDemo />
      <SliderDemo />
      <SwitchDemo />
      <CalendarDemo />
      <FormDemo />
    </DemoSection>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(() => new Date());

  return (
    <DemoSubsection title="Calendar">
      <DemoBox className="flex-col items-start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-sm border"
        />
      </DemoBox>
    </DemoSubsection>
  );
}

function CheckboxDemo() {
  const [checked, { set: setChecked }] = useBoolean(false);

  return (
    <DemoSubsection title="Checkbox">
      <DemoBox>
        <div className="flex items-center gap-2">
          <Checkbox
            id="cb1"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <Label htmlFor="cb1">Accept terms</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb2" disabled />
          <Label htmlFor="cb2">Disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb3" checked disabled />
          <Label htmlFor="cb3">Checked + Disabled</Label>
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function ComboboxDemo() {
  const [value, setValue] = useState("");

  const options = [
    { label: "Fire Mage", value: "fire" },
    { label: "Frost Mage", value: "frost" },
    { label: "Arcane Mage", value: "arcane" },
    { label: "Shadow Priest", value: "shadow" },
    { label: "Outlaw Rogue", value: "outlaw" },
  ];

  return (
    <DemoSubsection title="Combobox">
      <DemoBox className="flex-col items-start">
        <Combobox
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Select a spec..."
          searchPlaceholder="Search specs..."
          emptyText="No spec found."
        />
      </DemoBox>
    </DemoSubsection>
  );
}

function FormDemo() {
  const [submitted, setSubmitted] = useState<string | undefined>();

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: ({ value }) => setSubmitted(value.name),
    validators: {
      onChange: z.object({ name: z.string().min(1, "Name is required.") }),
    },
  });

  return (
    <DemoSubsection title="Form">
      <DemoBox className="flex-col items-stretch">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-3"
        >
          <form.Field name="name">
            {(field) => (
              <Field
                data-invalid={field.state.meta.errors.length > 0 || undefined}
              >
                <FieldLabel htmlFor={field.name}>Character name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Arthas"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
          <Button type="submit" size="sm">
            Submit
          </Button>
        </form>
        {submitted ? (
          <p className="text-muted-foreground text-xs">
            Submitted: {submitted}
          </p>
        ) : null}
      </DemoBox>
    </DemoSubsection>
  );
}

function InputDemo() {
  return (
    <DemoSubsection title="Input">
      <DemoBox className="flex-col items-stretch">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled" disabled />
        <Input type="email" placeholder="Email" />
      </DemoBox>
    </DemoSubsection>
  );
}

function InputGroupDemo() {
  return (
    <DemoSubsection title="Input Group">
      <DemoBox className="flex-col items-stretch">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Search className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Mail className="size-4" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Email" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>
              <Eye className="size-3.5" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupAddon align="block-start">
            <InputGroupText>Message</InputGroupText>
          </InputGroupAddon>
          <InputGroupTextarea placeholder="Write something..." rows={3} />
        </InputGroup>
      </DemoBox>
    </DemoSubsection>
  );
}

function InputOtpDemo() {
  return (
    <DemoSubsection title="Input OTP">
      <DemoBox className="flex-col items-start">
        <InputOTP defaultValue="123456" maxLength={OTP_SLOTS.length}>
          <InputOTPGroup>
            {OTP_SLOTS.map((index) => (
              <InputOTPSlot index={index} key={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </DemoBox>
    </DemoSubsection>
  );
}

function LabelDemo() {
  return (
    <DemoSubsection title="Label">
      <DemoBox className="flex-col items-start">
        <div className="space-y-1">
          <Label htmlFor="label-demo">Email</Label>
          <Input id="label-demo" placeholder="you@example.com" />
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function SelectDemo() {
  return (
    <DemoSubsection title="Select">
      <DemoBox className="flex-col items-start">
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick a spec" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mage</SelectLabel>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="frost">Frost</SelectItem>
              <SelectItem value="arcane">Arcane</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Warrior</SelectLabel>
              <SelectItem value="arms">Arms</SelectItem>
              <SelectItem value="fury">Fury</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Small trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </DemoBox>
    </DemoSubsection>
  );
}

function SliderDemo() {
  const [value, setValue] = useState([40]);

  return (
    <DemoSubsection title="Slider">
      <DemoBox className="flex-col items-stretch">
        <div className="space-y-3">
          <Label>
            Single value:
            {value[0]}
          </Label>
          <Slider value={value} onValueChange={setValue} max={100} step={1} />
        </div>
        <div className="space-y-3">
          <Label>Range</Label>
          <Slider defaultValue={[20, 80]} max={100} step={1} />
        </div>
        <div className="space-y-3">
          <Label>Disabled</Label>
          <Slider defaultValue={[50]} max={100} step={1} disabled />
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function SwitchDemo() {
  const [checked, { set: setChecked }] = useBoolean(false);

  return (
    <DemoSubsection title="Switch">
      <DemoBox>
        <div className="flex items-center gap-2">
          <Switch
            id="switch-demo"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="switch-demo">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-sm" size="sm" defaultChecked />
          <Label htmlFor="switch-sm">Small</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="switch-disabled" disabled />
          <Label htmlFor="switch-disabled">Disabled</Label>
        </div>
      </DemoBox>
    </DemoSubsection>
  );
}

function TextareaDemo() {
  return (
    <DemoSubsection title="Textarea">
      <DemoBox className="flex-col items-stretch">
        <Textarea placeholder="Type your message here." />
        <Textarea placeholder="Disabled" disabled />
      </DemoBox>
    </DemoSubsection>
  );
}
