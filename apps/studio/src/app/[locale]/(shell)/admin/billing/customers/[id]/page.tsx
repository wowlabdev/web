import { AdminCustomerDetail } from "@/components/admin/billing";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return <AdminCustomerDetail customerId={id} />;
}
