import { connection } from "next/server";
import { Suspense } from "react";

import { SignInCard } from "./sign-in-card";
import { SignInSkeleton } from "./sign-in-skeleton";

type SignInPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export function SignInPage({ searchParams }: Readonly<SignInPageProps>) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-10">
      <Suspense fallback={<SignInSkeleton />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SignInContent({ searchParams }: Readonly<SignInPageProps>) {
  await connection();
  const resolved = await searchParams;
  const nextValue = resolved.next;
  const redirectTo = Array.isArray(nextValue) ? nextValue[0] : nextValue;

  return <SignInCard redirectTo={redirectTo} />;
}
