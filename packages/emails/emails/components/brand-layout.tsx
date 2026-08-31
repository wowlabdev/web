import type { ReactNode } from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

import { brand, fontStack, SUPPORT_EMAIL, WEBSITE_URL } from "./theme";

const LOGO_SRC = "https://wowlab.gg/logo.png";
const supportHref = `mailto:${SUPPORT_EMAIL}`;

export interface BrandLayoutProps {
  readonly children: ReactNode;
  readonly heading: string;
  readonly preview: string;
}

export function ActionButton({
  children,
  href,
}: Readonly<{ children: ReactNode; href: string }>) {
  return (
    <Section className="my-[24px] text-center">
      <Button
        href={href}
        className="rounded-[8px] bg-primary px-[24px] py-[12px] text-[14px] font-semibold text-primary-foreground no-underline"
      >
        {children}
      </Button>
    </Section>
  );
}

export function BrandLayout({ children, heading, preview }: BrandLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: { extend: { colors: brand } },
        }}
      >
        <Head>
          <meta name="color-scheme" content="dark only" />
          <meta name="supported-color-schemes" content="dark only" />
        </Head>
        <Preview>{preview}</Preview>
        <Body
          className="bg-background py-[40px] font-sans text-foreground"
          style={{ fontFamily: fontStack }}
        >
          <Container className="mx-auto w-full max-w-[480px] px-[12px]">
            <Section className="px-[8px] py-[24px] text-center">
              <Img
                src={LOGO_SRC}
                alt="WoW Lab"
                height="40"
                className="mx-auto h-[40px] w-auto"
              />
            </Section>
            <Section className="rounded-[12px] border border-solid border-border bg-card px-[32px] py-[32px]">
              <Heading
                as="h1"
                className="m-0 mb-[16px] text-[20px] font-bold text-foreground"
              >
                {heading}
              </Heading>
              {children}
            </Section>
            <Section className="px-[8px] py-[24px] text-center">
              <Text className="m-0 text-[12px] leading-[18px] text-muted">
                World of Warcraft simulation and theorycraft
              </Text>
              <Text className="m-0 mt-[6px] text-[12px] leading-[18px] text-muted">
                This address was used on WoW Lab. If it was not you, ignore this
                email.
              </Text>
              <Text className="m-0 mt-[6px] text-[12px] leading-[18px] text-muted">
                Questions? Reach us at{" "}
                <Link href={supportHref} className="text-link no-underline">
                  {SUPPORT_EMAIL}
                </Link>
              </Text>
              <Text className="m-0 mt-[10px] text-[12px] leading-[18px]">
                <Link href={WEBSITE_URL} className="text-link no-underline">
                  wowlab.gg
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export function ExpiryNote({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Text className="m-0 mt-[16px] text-[13px] leading-[20px] text-muted">
      {children}
    </Text>
  );
}

export function FallbackLink({ href }: Readonly<{ href: string }>) {
  return (
    <>
      <Text className="m-0 mt-[8px] text-[13px] leading-[20px] text-muted">
        Or copy and paste this link into your browser:
      </Text>
      <Text className="m-0 mt-[4px] break-all text-[13px] leading-[20px]">
        <Link href={href} className="text-primary underline">
          {href}
        </Link>
      </Text>
    </>
  );
}

export function OtpCode({ code }: Readonly<{ code: string }>) {
  return (
    <Section className="my-[24px] text-center">
      <Text className="m-0 mb-[8px] text-[13px] text-muted">
        Enter this code:
      </Text>
      <Text className="m-0 inline-block rounded-[8px] border border-solid border-border bg-secondary px-[20px] py-[12px] text-[28px] font-bold leading-none tracking-[6px] text-foreground">
        {code}
      </Text>
    </Section>
  );
}
