import { ExternalRedirectWarning } from "@/components/go";

type ExternalRedirectWarningPageProps = {
  searchParams: Promise<{ target?: string }>;
};

export default function ExternalRedirectWarningPage({
  searchParams,
}: Readonly<ExternalRedirectWarningPageProps>) {
  return <ExternalRedirectWarning searchParams={searchParams} />;
}
