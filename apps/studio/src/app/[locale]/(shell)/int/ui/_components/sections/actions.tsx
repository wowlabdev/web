import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Mail,
  Plus,
  Underline,
} from "lucide-react";

import { Button } from "@wowlab/shared/components/ui/button";
import { ButtonGroup } from "@wowlab/shared/components/ui/button-group";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { Toggle } from "@wowlab/shared/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

import { DemoBox, DemoSection, DemoSubsection } from "../demo";

export function ActionsSection() {
  return (
    <DemoSection id="actions" title="Button">
      <DemoSubsection title="Variants">
        <DemoBox>
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Sizes">
        <DemoBox>
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus />
          </Button>
          <Button size="icon-sm">
            <Plus />
          </Button>
          <Button size="icon-xs">
            <Plus />
          </Button>
          <Button size="icon-lg">
            <Plus />
          </Button>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="With Icons">
        <DemoBox>
          <Button>
            <Mail data-icon="inline-start" />
            Login with Email
          </Button>
          <Button variant="outline">
            <LogoSpinner data-icon="inline-start" className="size-4" />
            Loading
          </Button>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="States">
        <DemoBox>
          <Button disabled>Disabled</Button>
          <Button asChild>
            <a href="#">As Link</a>
          </Button>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Button Group">
        <DemoBox>
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Toggle">
        <DemoBox>
          <Toggle aria-label="Toggle bold">
            <Bold className="size-4" />
          </Toggle>
          <Toggle defaultPressed aria-label="Toggle italic">
            <Italic className="size-4" />
          </Toggle>
          <Toggle disabled aria-label="Toggle underline">
            <Underline className="size-4" />
          </Toggle>
        </DemoBox>
      </DemoSubsection>

      <DemoSubsection title="Toggle Group">
        <DemoBox className="flex-col items-start">
          <ToggleGroup type="single" defaultValue="center">
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <AlignCenter className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </DemoBox>
      </DemoSubsection>
    </DemoSection>
  );
}
