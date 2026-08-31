"use client";

import { CalendarDays } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@wowlab/shared/components/ui/accordion";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@wowlab/shared/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";
import { LightboxTrigger } from "@wowlab/shared/components/ui/lightbox";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";

import { DemoBox, DemoSubsection } from "../demo";

export function AccordionDemo() {
  return (
    <DemoSubsection title="Accordion">
      <DemoBox className="flex-col items-stretch">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does simulation work?</AccordionTrigger>
            <AccordionContent>
              The engine runs thousands of fight iterations and reports a DPS
              distribution.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Where are my results stored?</AccordionTrigger>
            <AccordionContent>
              All results live in your account so you can revisit and share
              them.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I import a SimC profile?</AccordionTrigger>
            <AccordionContent>
              Yes. Paste a profile into the importer to populate gear, talents,
              and configuration.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoBox>
    </DemoSubsection>
  );
}

export function CollapsibleDemo() {
  return (
    <DemoSubsection title="Collapsible">
      <DemoBox className="flex-col items-stretch">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Toggle content
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-muted mt-2 rounded-sm p-3 text-xs">
              This content is collapsible.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DemoBox>
    </DemoSubsection>
  );
}

export function ContextMenuDemo() {
  return (
    <DemoSubsection title="Context Menu">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <DemoBox className="h-24 justify-center">
            <span className="text-muted-foreground text-xs">
              Right-click here
            </span>
          </DemoBox>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem>
            Run Simulation
            <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Duplicate</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>
            Show Timeline
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </DemoSubsection>
  );
}

export function HoverCardDemo() {
  return (
    <DemoSubsection title="Hover Card">
      <DemoBox>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@WoWLab</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">WoW Lab</h4>
                <p className="text-xs text-muted-foreground">
                  World of Warcraft simulation and theorycrafting platform.
                </p>
                <div className="flex items-center pt-2">
                  <CalendarDays className="mr-2 size-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">
                    Joined December 2021
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </DemoBox>
    </DemoSubsection>
  );
}

export function LightboxDemo() {
  return (
    <DemoSubsection title="Lightbox">
      <DemoBox>
        <LightboxTrigger
          variant="image"
          title="Click to open lightbox"
          src="https://github.com/legacy3.png"
        >
          <Button variant="outline">Open Lightbox</Button>
        </LightboxTrigger>
        <LightboxTrigger
          variant="diagram"
          title="Diagram lightbox"
          src="https://github.com/legacy3.png"
          initialZoom={2}
        >
          <Button variant="outline">Open Lightbox (Zoomed)</Button>
        </LightboxTrigger>
      </DemoBox>
    </DemoSubsection>
  );
}

export function PopoverDemo() {
  return (
    <DemoSubsection title="Popover">
      <DemoBox>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Popover Title</PopoverTitle>
              <PopoverDescription>
                This is a popover with a header and description.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </DemoBox>
    </DemoSubsection>
  );
}

export function TooltipDemo() {
  return (
    <DemoSubsection title="Tooltip">
      <DemoBox>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DemoBox>
    </DemoSubsection>
  );
}
