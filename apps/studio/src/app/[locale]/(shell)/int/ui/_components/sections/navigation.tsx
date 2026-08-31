"use client";

import { useState } from "react";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@wowlab/shared/components/ui/breadcrumb";
import { Link } from "@wowlab/shared/components/ui/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@wowlab/shared/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@wowlab/shared/components/ui/pagination";
import { StepperNav } from "@wowlab/shared/components/ui/stepper-nav";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

export function NavigationSection() {
  return (
    <DemoSection id="navigation" title="Navigation">
      <LinkDemo />
      <BreadcrumbDemo />
      <NavigationMenuDemo />
      <TabsDemo />
      <UrlTabsDemo />
      <StepperDemo />
      <PaginationDemo />
    </DemoSection>
  );
}

function BreadcrumbDemo() {
  return (
    <DemoSubsection title="Breadcrumb">
      <DemoBox>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Rankings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Mage</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Fire</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoBox>
    </DemoSubsection>
  );
}

function LinkDemo() {
  return (
    <DemoSubsection title="Link">
      <DemoBox>
        <Link href="#">Default link</Link>
        <Link href="#" className="text-muted-foreground">
          Muted link
        </Link>
      </DemoBox>
    </DemoSubsection>
  );
}

function NavigationMenuDemo() {
  return (
    <DemoSubsection title="Navigation Menu">
      <DemoBox>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Specs</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-1">
                  <li>
                    <NavigationMenuLink href="#">Fire Mage</NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">Frost Mage</NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">
                      Arcane Mage
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#">Rotations</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </DemoBox>
    </DemoSubsection>
  );
}

function PaginationDemo() {
  return (
    <DemoSubsection title="Pagination">
      <DemoBox>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DemoBox>
    </DemoSubsection>
  );
}

function StepperDemo() {
  const [currentStep, setCurrentStep] = useState("import");

  const steps = [
    { id: "import" },
    { id: "configure" },
    { id: "simulate" },
  ] as const;

  return (
    <DemoSubsection title="Stepper Nav">
      <DemoBox className="flex-col items-stretch">
        <StepperNav
          steps={[...steps]}
          currentId={currentStep}
          onSelect={setCurrentStep}
          labels={{
            configure: "Configure",
            import: "Import",
            simulate: "Simulate",
          }}
        />
        <p className="text-muted-foreground text-xs">
          Current step: {currentStep}
        </p>
      </DemoBox>
    </DemoSubsection>
  );
}

function TabsDemo() {
  return (
    <DemoSubsection title="Tabs">
      <DemoBox className="flex-col items-stretch">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Character</TabsTrigger>
            <TabsTrigger value="b">Talents</TabsTrigger>
            <TabsTrigger value="c">Gear</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <p className="text-muted-foreground p-2 text-xs">
              Character import and stats.
            </p>
          </TabsContent>
          <TabsContent value="b">
            <p className="text-muted-foreground p-2 text-xs">
              Talent tree configuration.
            </p>
          </TabsContent>
          <TabsContent value="c">
            <p className="text-muted-foreground p-2 text-xs">
              Equipment and item levels.
            </p>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="x">
          <TabsList variant="line">
            <TabsTrigger value="x">Results</TabsTrigger>
            <TabsTrigger value="y">Timeline</TabsTrigger>
            <TabsTrigger value="z">Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="x">
            <p className="text-muted-foreground p-2 text-xs">
              Line variant tab content.
            </p>
          </TabsContent>
        </Tabs>
      </DemoBox>
    </DemoSubsection>
  );
}

function UrlTabsDemo() {
  return (
    <DemoSubsection title="URL Tabs">
      <DemoBox className="flex-col items-stretch">
        <UrlTabs queryKey="showcase-tab" defaultValue="first">
          <TabsList variant="line">
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="first">
            <p className="text-muted-foreground p-2 text-xs">
              URL-synced tab. Check the query string.
            </p>
          </TabsContent>
          <TabsContent value="second">
            <p className="text-muted-foreground p-2 text-xs">Second tab.</p>
          </TabsContent>
        </UrlTabs>
      </DemoBox>
    </DemoSubsection>
  );
}
