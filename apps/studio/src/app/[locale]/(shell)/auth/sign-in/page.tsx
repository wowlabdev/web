import { SignInPage } from "@/components/account/auth/sign-in-page";

export default function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ next?: string | string[] }>;
}>) {
  return <SignInPage searchParams={searchParams} />;
}
