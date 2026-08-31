"use client";

import { Flame, Settings, Swords, User, Wand2, Zap } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@wowlab/shared/components/ui/alert-dialog";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@wowlab/shared/components/ui/command";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@wowlab/shared/components/ui/sheet";

import { DemoBox, DemoSubsection } from "../demo";

export function AlertDialogDemo() {
  return (
    <DemoSubsection title="Alert Dialog">
      <DemoBox>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Delete Simulation</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes the simulation and its results. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DemoBox>
    </DemoSubsection>
  );
}

export function CommandDemo() {
  return (
    <DemoSubsection title="Command">
      <div className="mx-auto max-w-md rounded-sm border">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Simulate">
              <CommandItem>
                <Swords className="mr-2 size-4" />
                New Simulation
              </CommandItem>
              <CommandItem>
                <Flame className="mr-2 size-4" />
                Import Character
              </CommandItem>
              <CommandItem>
                <Wand2 className="mr-2 size-4" />
                Browse Rotations
                <CommandShortcut>Ctrl+R</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
              <CommandItem>
                <User className="mr-2 size-4" />
                Profile
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 size-4" />
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </DemoSubsection>
  );
}

export function DialogDemo() {
  return (
    <DemoSubsection title="Dialog">
      <DemoBox>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. It provides context for the
                action.
              </DialogDescription>
            </DialogHeader>
            <div className="text-xs">Dialog body content.</div>
            <DialogFooter showCloseButton>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoBox>
    </DemoSubsection>
  );
}

export function DropdownMenuDemo() {
  return (
    <DemoSubsection title="Dropdown Menu">
      <DemoBox>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 size-4" />
                Profile
                <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Zap className="mr-2 size-4" />
                My Simulations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Show panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoBox>
    </DemoSubsection>
  );
}

export function SheetDemo() {
  return (
    <DemoSubsection title="Sheet">
      <DemoBox>
        {(["right", "left", "top", "bottom"] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Sheet ({side})</SheetTitle>
                <SheetDescription>
                  A sheet sliding from the {side}.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 p-4 text-xs">Sheet content.</div>
              <SheetFooter>
                <Button size="sm">Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </DemoBox>
    </DemoSubsection>
  );
}
