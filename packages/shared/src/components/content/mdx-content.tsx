import type { MDXComponents } from "mdx/types";

import * as runtime from "react/jsx-runtime";

import {
  MdAccordion,
  MdAccordionItem,
  MdAlert,
  MdBadge,
  MdBlockquote,
  MdCard,
  MdCardGrid,
  MdCode,
  MdCollapsible,
  MdDel,
  MdEm,
  MdFeatureCard,
  MdH1,
  MdH2,
  MdH3,
  MdH4,
  MdH5,
  MdH6,
  MdHr,
  MdIcon,
  MdImg,
  MdKbd,
  MdLi,
  MdLink,
  MdOl,
  MdParagraph,
  MdPre,
  MdQ,
  MdStep,
  MdSteps,
  MdStrong,
  MdTabContent,
  MdTable,
  MdTabList,
  MdTabs,
  MdTabTrigger,
  MdTbody,
  MdTd,
  MdTh,
  MdThead,
  MdTr,
  MdU,
  MdUl,
  MdVideo,
} from "@wowlab/shared/components/content/md";

const nativeComponents = {
  a: MdLink,
  blockquote: MdBlockquote,
  code: MdCode,
  del: MdDel,
  em: MdEm,
  h1: MdH1,
  h2: MdH2,
  h3: MdH3,
  h4: MdH4,
  h5: MdH5,
  h6: MdH6,
  hr: MdHr,
  img: MdImg,
  li: MdLi,
  ol: MdOl,
  p: MdParagraph,
  pre: MdPre,
  strong: MdStrong,
  table: MdTable,
  tbody: MdTbody,
  td: MdTd,
  th: MdTh,
  thead: MdThead,
  tr: MdTr,
  ul: MdUl,
};

const customComponents = {
  Accordion: MdAccordion,
  AccordionItem: MdAccordionItem,
  Alert: MdAlert,
  Badge: MdBadge,
  Card: MdCard,
  CardGrid: MdCardGrid,
  Collapsible: MdCollapsible,
  FeatureCard: MdFeatureCard,
  Icon: MdIcon,
  Kbd: MdKbd,
  Q: MdQ,
  Step: MdStep,
  Steps: MdSteps,
  TabContent: MdTabContent,
  TabList: MdTabList,
  Tabs: MdTabs,
  TabTrigger: MdTabTrigger,
  U: MdU,
  Video: MdVideo,
};

type MdxContentProps = {
  code: string;
  components?: MDXComponents;
};

export function MdxContent({ code, components }: Readonly<MdxContentProps>) {
  // eslint-disable-next-line sonarjs/code-eval -- MDX is compiled to JS by Velite at build time; executing the trusted compiled module is the MDX runtime
  const fn = new Function(code);
  // eslint-disable-next-line sonarjs/code-eval -- MDX is compiled to JS by Velite at build time; executing the trusted compiled module is the MDX runtime
  const Component = fn({ ...runtime }).default;

  return (
    <Component
      components={{ ...nativeComponents, ...customComponents, ...components }}
    />
  );
}
