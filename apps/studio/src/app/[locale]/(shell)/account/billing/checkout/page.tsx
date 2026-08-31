import {
  CheckoutPage,
  type CheckoutSearchParams,
} from "@/components/account/billing/checkout/checkout-page";
import { generateUserCustomerAuthToken } from "@/lib/paddle/customers";
import { requireServerClaims } from "@wowlab/shared/lib/supabase/server";

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<CheckoutSearchParams>;
}>) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);

  const { claims } = await requireServerClaims();
  const customerAuthToken = await generateUserCustomerAuthToken(claims.sub);

  return (
    <CheckoutPage
      customerAuthToken={customerAuthToken}
      email={claims.email ?? ""}
      locale={locale}
      searchParams={sp}
      userId={claims.sub}
    />
  );
}
