import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer/server";
import { FAQJsonLd } from "next-seo";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@wowlab/shared/components/ui/accordion";
import { appUrl, href, routes } from "@wowlab/shared/lib/routing";

type FaqItem = {
  answer: ReactNode;
  answerText: string;
  question: ReactNode;
  questionText: string;
};

export function PricingFaq() {
  const content = useIntlayer("pricingPage");

  const items: FaqItem[] = [
    {
      answer: content.faq1A,
      answerText: content.faq1A.value,
      question: content.faq1Q,
      questionText: content.faq1Q.value,
    },
    {
      answer: (
        <>
          {content.faq2APart1}{" "}
          <Link
            className="underline underline-offset-2"
            href={appUrl(
              href(routes.dev.docs.page, { slug: "browser-vs-pool" }),
            )}
          >
            {content.faqDocsLink}
          </Link>
          .
        </>
      ),
      answerText: `${content.faq2APart1.value} ${content.faqDocsLink.value}.`,
      question: content.faq2Q,
      questionText: content.faq2Q.value,
    },
    {
      answer: content.faq3A,
      answerText: content.faq3A.value,
      question: content.faq3Q,
      questionText: content.faq3Q.value,
    },
    {
      answer: content.faq4A,
      answerText: content.faq4A.value,
      question: content.faq4Q,
      questionText: content.faq4Q.value,
    },
    {
      answer: content.faq5A,
      answerText: content.faq5A.value,
      question: content.faq5Q,
      questionText: content.faq5Q.value,
    },
    {
      answer: content.faq6A,
      answerText: content.faq6A.value,
      question: content.faq6Q,
      questionText: content.faq6Q.value,
    },
    {
      answer: content.faq7A,
      answerText: content.faq7A.value,
      question: content.faq7Q,
      questionText: content.faq7Q.value,
    },
  ];

  return (
    <>
      <FAQJsonLd
        questions={items.map((item) => ({
          answer: item.answerText,
          question: item.questionText,
        }))}
      />
      <h2 className="text-lg font-semibold">{content.questionsHeading}</h2>
      <Accordion className="w-full" collapsible type="single">
        {items.map((item, index) => (
          <AccordionItem key={item.questionText} value={`item-${index}`}>
            <AccordionTrigger className="text-sm font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
