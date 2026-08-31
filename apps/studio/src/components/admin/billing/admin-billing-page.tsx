"use client";

import { useIntlayer } from "next-intlayer";

import { UrlTabs } from "@/components/shared/ui/url-tabs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";

import { CustomersTab } from "./customers-tab";
import { OverviewTab } from "./overview-tab";
import { SubscriptionsTab } from "./subscriptions-tab";
import { TransactionsTab } from "./transactions-tab";

export function AdminBillingPage() {
  const content = useIntlayer("admin");

  return (
    <UrlTabs className="space-y-4" defaultValue="overview" queryKey="tab">
      <TabsList>
        <TabsTrigger value="overview">
          {content.billingPage.tabOverview}
        </TabsTrigger>
        <TabsTrigger value="subscriptions">
          {content.billingPage.tabSubscriptions}
        </TabsTrigger>
        <TabsTrigger value="customers">
          {content.billingPage.tabCustomers}
        </TabsTrigger>
        <TabsTrigger value="transactions">
          {content.billingPage.tabTransactions}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="subscriptions">
        <SubscriptionsTab />
      </TabsContent>
      <TabsContent value="customers">
        <CustomersTab />
      </TabsContent>
      <TabsContent value="transactions">
        <TransactionsTab />
      </TabsContent>
    </UrlTabs>
  );
}
