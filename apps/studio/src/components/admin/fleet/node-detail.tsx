"use client";

import { useIntlayer } from "next-intlayer";
import { Fragment, type ReactNode } from "react";

import type { FleetNode } from "@/lib/query/services";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";

type NodeDetailProps = {
  node: FleetNode;
};

export function NodeDetail({ node }: Readonly<NodeDetailProps>) {
  const content = useIntlayer("admin");
  const host = `${node.givenName}.wowlab.internal`;
  const sshCmd = (payload: string, opts?: { tty?: boolean }) => ({
    cmd: `ssh ${opts?.tty ? "-tt " : ""}root@${host} '${payload}'`,
    display: payload,
  });

  const commands: Array<{ label: string; cmd: string; display: string }> = [
    {
      ...sshCmd("systemctl status wowlab-node"),
      label: content.fleet.serviceStatus.value,
    },
    {
      ...sshCmd("docker logs -f --tail 200 wowlab-node"),
      label: content.fleet.logs.value,
    },
    {
      ...sshCmd("uptime && free -h && df -h /"),
      label: content.fleet.health.value,
    },
    {
      cmd: `ssh root@${host}`,
      display: `ssh root@${host}`,
      label: content.fleet.shell.value,
    },
    {
      ...sshCmd("docker exec -it wowlab-node sh", { tty: true }),
      label: content.fleet.containerShell.value,
    },
    {
      ...sshCmd("docker restart wowlab-node"),
      label: content.fleet.restart.value,
    },
    {
      ...sshCmd(
        "docker pull ghcr.io/legacy3/wowlab-node:latest && systemctl restart wowlab-node",
      ),
      label: content.fleet.update.value,
    },
  ];

  const identity: Array<{ label: string; value: ReactNode }> = [
    { label: content.fleet.user.value, value: node.userName },
    {
      label: content.fleet.ip.value,
      value: (
        <div className="flex flex-col gap-1">
          {node.ipAddresses.map((ip) => (
            <div key={ip} className="flex items-center gap-2">
              <CopyButton value={ip} />
              <span className="font-mono">{ip}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: content.fleet.tags.value,
      value: node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {node.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag.replace("tag:", "")}
            </Badge>
          ))}
        </div>
      ),
    },
    { label: content.fleet.status.value, value: node.status },
    {
      label: content.fleet.version.value,
      value: node.version && <span className="font-mono">{node.version}</span>,
    },
    { label: content.fleet.platform.value, value: node.platform },
    { label: content.fleet.cores.value, value: node.totalCores },
  ].filter((row) => row.value);

  return (
    <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2">
      <section>
        <h4 className="text-muted-foreground mb-4 text-[11px] font-semibold tracking-wider uppercase">
          {content.fleet.identity}
        </h4>
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
          {identity.map(({ label, value }) => (
            <Fragment key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section>
        <h4 className="text-muted-foreground mb-4 text-[11px] font-semibold tracking-wider uppercase">
          {content.fleet.commands}
        </h4>
        <ItemGroup className="divide-border/50 divide-y">
          {commands.map(({ cmd, display, label }) => (
            <Item key={label} size="sm" className="group gap-4">
              <ItemTitle className="text-muted-foreground w-28 shrink-0 text-sm">
                {label}
              </ItemTitle>
              <ItemContent className="min-w-0 flex-1">
                <ItemDescription className="text-foreground/80 line-clamp-none truncate font-mono text-xs">
                  {display}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <CopyButton value={cmd} />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </section>
    </div>
  );
}
