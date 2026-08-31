import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@wowlab/shared/components/ui/accordion";

type MdAccordionItemProps = {
  children: ReactNode;
  title: string;
  value?: string;
};

type MdAccordionProps = {
  children: ReactNode;
  isMultiple?: boolean;
};

export function MdAccordion({
  children,
  isMultiple = false,
}: Readonly<MdAccordionProps>) {
  if (isMultiple) {
    return (
      <Accordion type="multiple" className="my-4">
        {children}
      </Accordion>
    );
  }

  return (
    <Accordion type="single" collapsible className="my-4">
      {children}
    </Accordion>
  );
}

export function MdAccordionItem({
  children,
  title,
  value,
}: Readonly<MdAccordionItemProps>) {
  return (
    <AccordionItem value={value ?? title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}
