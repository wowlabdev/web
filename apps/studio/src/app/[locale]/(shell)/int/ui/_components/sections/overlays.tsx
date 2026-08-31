"use client";

import { DemoSection } from "../demo";
import {
  AlertDialogDemo,
  CommandDemo,
  DialogDemo,
  DropdownMenuDemo,
  SheetDemo,
} from "./overlays-menus";
import {
  AccordionDemo,
  CollapsibleDemo,
  ContextMenuDemo,
  HoverCardDemo,
  LightboxDemo,
  PopoverDemo,
  TooltipDemo,
} from "./overlays-triggers";

export function OverlaysSection() {
  return (
    <DemoSection id="overlays" title="Overlays & Popups">
      <TooltipDemo />
      <PopoverDemo />
      <HoverCardDemo />
      <LightboxDemo />
      <CollapsibleDemo />
      <AccordionDemo />
      <ContextMenuDemo />
      <DropdownMenuDemo />
      <CommandDemo />
      <DialogDemo />
      <AlertDialogDemo />
      <SheetDemo />
    </DemoSection>
  );
}
