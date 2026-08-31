"use client";

import { useBoolean } from "ahooks";

import type { ProviderMeta } from "@wowlab/shared/lib/providers";

import { useUserAccount } from "@/lib/query/services/user";
import { Switch } from "@wowlab/shared/components/ui/switch";
import { OAUTH_PROVIDERS } from "@wowlab/shared/lib/providers";

type ProviderRowProps = {
  meta: ProviderMeta;
};

export function ConnectionsList() {
  return (
    <div className="space-y-0 divide-y">
      {OAUTH_PROVIDERS.map((meta) => (
        <ProviderRow key={meta.provider} meta={meta} />
      ))}
    </div>
  );
}

function ProviderRow({ meta }: Readonly<ProviderRowProps>) {
  const { linkIdentity } = useUserAccount();
  const [linking, { setFalse: stopLinking, setTrue: startLinking }] =
    useBoolean(false);

  const isLinked = false;
  const Icon = meta.icon;

  const handleLink = async () => {
    if (!meta.isEnabled) {
      return;
    }

    startLinking();

    try {
      await linkIdentity(meta.provider);
    } catch {
      stopLinking();
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2.5">
        <span className="text-muted-foreground">
          <Icon width={16} height={16} />
        </span>
        <span className="text-sm font-medium">{meta.label}</span>
      </div>
      <Switch
        checked={isLinked}
        onCheckedChange={() => handleLink()}
        disabled={!meta.isEnabled || linking}
      />
    </div>
  );
}
