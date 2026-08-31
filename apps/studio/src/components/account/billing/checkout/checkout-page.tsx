import { InlineCheckout } from "./inline-checkout";

export type CheckoutSearchParams = {
  discount?: string;
  plan?: string;
  priceId?: string;
  quantity?: string;
};

type CheckoutPageProps = {
  customerAuthToken: string | null;
  email: string;
  locale: string;
  searchParams: CheckoutSearchParams;
  userId: string;
};

export function CheckoutPage({
  customerAuthToken,
  email,
  locale,
  searchParams,
  userId,
}: Readonly<CheckoutPageProps>) {
  const quantity = Number.parseInt(searchParams.quantity ?? "1", 10);
  const plan =
    searchParams.plan === "guild" || searchParams.plan === "individual"
      ? searchParams.plan
      : undefined;

  return (
    <InlineCheckout
      customerAuthToken={customerAuthToken}
      discount={searchParams.discount}
      email={email}
      locale={locale}
      plan={plan}
      priceId={searchParams.priceId}
      quantity={Number.isFinite(quantity) && quantity > 0 ? quantity : 1}
      userId={userId}
    />
  );
}
