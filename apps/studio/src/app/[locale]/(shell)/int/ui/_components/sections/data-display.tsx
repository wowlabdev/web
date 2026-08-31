"use client";

import { useCreation } from "ahooks";
import {
  ChevronRight,
  Flame,
  Inbox,
  MoreHorizontal,
  Snowflake,
  Sparkles,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import { Badge, badgeVariants } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@wowlab/shared/components/ui/carousel";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";
import { Image } from "@wowlab/shared/components/ui/image";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";
import { Skeleton } from "@wowlab/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

void badgeVariants;

export function DataDisplaySection() {
  return (
    <DemoSection id="data-display" title="Data Display">
      <AvatarDemo />
      <BadgeDemo />
      <CardDemo />
      <CarouselDemo />
      <EmptyDemo />
      <ImageDemo />
      <ItemDemo />
      <ScrollAreaDemo />
      <SkeletonDemo />
      <TableDemo />
    </DemoSection>
  );
}

function AvatarDemo() {
  return (
    <DemoSubsection title="Avatar">
      <DemoBox>
        <Avatar>
          <AvatarImage src="https://github.com/legacy3.png" alt="legacy3" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </DemoBox>
      <DemoBox>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </DemoBox>
    </DemoSubsection>
  );
}

function BadgeDemo() {
  return (
    <DemoSubsection title="Badge">
      <DemoBox>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </DemoBox>
    </DemoSubsection>
  );
}

function CardDemo() {
  return (
    <DemoSubsection title="Card">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fire Mage</CardTitle>
            <CardDescription>Single target, 5 min fight.</CardDescription>
            <CardAction>
              <MoreHorizontal className="text-muted-foreground size-4" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>48,230 DPS average across 10,000 iterations.</p>
          </CardContent>
          <CardFooter>
            <span className="text-muted-foreground text-xs">
              Completed 2 min ago
            </span>
          </CardFooter>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Stat Weights</CardTitle>
            <CardDescription>Relative value per point.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Haste 1.21 &middot; Crit 1.08 &middot; Mastery 0.94</p>
          </CardContent>
        </Card>
      </div>
    </DemoSubsection>
  );
}

function CarouselDemo() {
  const slides = [
    { label: "Fire Mage", value: "48,230 DPS" },
    { label: "Frost Mage", value: "45,870 DPS" },
    { label: "Arcane Mage", value: "51,100 DPS" },
    { label: "Shadow Priest", value: "47,540 DPS" },
    { label: "Outlaw Rogue", value: "49,820 DPS" },
  ];

  return (
    <DemoSubsection title="Carousel">
      <Carousel className="mx-auto w-full max-w-sm">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.label}>
              <div className="bg-muted/30 flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border border-dashed p-6">
                <span className="text-xs font-medium">{slide.label}</span>
                <span className="text-muted-foreground text-xs">
                  {slide.value}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </DemoSubsection>
  );
}

function EmptyDemo() {
  return (
    <DemoSubsection title="Empty">
      <Empty className="rounded-sm border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>No simulations yet</EmptyTitle>
          <EmptyDescription>
            Import a character to run your first simulation.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </DemoSubsection>
  );
}

function ImageDemo() {
  return (
    <DemoSubsection title="Image">
      <DemoBox>
        <Image
          src="https://github.com/legacy3.png"
          alt="Demo image"
          width={120}
          height={120}
        />
        <Image
          src="https://github.com/legacy3.png"
          alt="Expandable demo image"
          width={120}
          height={120}
          expandable
        />
      </DemoBox>
    </DemoSubsection>
  );
}

function ItemDemo() {
  const specs = [
    {
      description: "Single target, 5 min fight.",
      dps: "48,230 DPS",
      icon: Flame,
      name: "Fire Mage",
    },
    {
      description: "Cleave, 3 targets.",
      dps: "45,870 DPS",
      icon: Snowflake,
      name: "Frost Mage",
    },
    {
      description: "Burst windows, single target.",
      dps: "51,100 DPS",
      icon: Sparkles,
      name: "Arcane Mage",
    },
  ];

  return (
    <DemoSubsection title="Item">
      <div className="flex max-w-md flex-col gap-4">
        <ItemGroup className="rounded-sm border">
          {specs.map((spec, index) => (
            <ItemGroup key={spec.name}>
              {index > 0 ? <ItemSeparator /> : null}
              <Item>
                <ItemMedia variant="icon">
                  <spec.icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{spec.name}</ItemTitle>
                  <ItemDescription>{spec.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">{spec.dps}</Badge>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal />
                  </Button>
                </ItemActions>
              </Item>
            </ItemGroup>
          ))}
        </ItemGroup>
        <Item variant="outline" size="sm" asChild>
          <a href="#data-display">
            <ItemMedia variant="icon">
              <Sparkles />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>View all simulation results</ItemTitle>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="size-4" />
            </ItemActions>
          </a>
        </Item>
      </div>
    </DemoSubsection>
  );
}

function ScrollAreaDemo() {
  const specs = [
    "Fire Mage",
    "Frost Mage",
    "Arcane Mage",
    "Shadow Priest",
    "Outlaw Rogue",
    "Assassination Rogue",
    "Subtlety Rogue",
    "Arms Warrior",
    "Fury Warrior",
    "Protection Warrior",
    "Retribution Paladin",
    "Balance Druid",
  ];

  return (
    <DemoSubsection title="Scroll Area">
      <ScrollArea className="h-40 w-64 rounded-sm border">
        <div className="p-3">
          {specs.map((spec) => (
            <p key={spec} className="py-1 text-xs">
              {spec}
            </p>
          ))}
        </div>
      </ScrollArea>
    </DemoSubsection>
  );
}

function SkeletonDemo() {
  return (
    <DemoSubsection title="Skeleton">
      <DemoBox className="flex-col items-start">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </DemoBox>
    </DemoSubsection>
  );
}

function TableDemo() {
  const data = useCreation(
    () => [
      { dps: "48,230", spec: "Fire Mage", status: "Complete" },
      { dps: "45,870", spec: "Frost Mage", status: "Complete" },
      { dps: "51,100", spec: "Arcane Mage", status: "Running" },
    ],
    [],
  );

  return (
    <DemoSubsection title="Table">
      <Table>
        <TableCaption>Recent simulation results.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Spec</TableHead>
            <TableHead className="text-right">DPS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.spec}>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.spec}</TableCell>
              <TableCell className="text-right">{row.dps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Average</TableCell>
            <TableCell className="text-right">48,400</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </DemoSubsection>
  );
}
