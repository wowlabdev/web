import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

export type CommandGroup = { commands: CommandRow[]; title: string };
export type CommandRow = { command: string; description: string };

export function useAddonCommands(): CommandGroup[] {
  const content = useIntlayer("addonPage");

  // prettier-ignore
  return useMemo(
    () => [
      {
        commands: [
          cmd(
            "/wlab",
            content.cmdToggle.value,
          ),
          cmd(
            "/wlab help",
            content.cmdHelp.value,
          ),
        ],
        title: content.groupEssentials.value,
      },
      {
        commands: [
          cmd(
            "/wlab gear",
            content.cmdTabGear.value,
          ),
          cmd(
            "/wlab wishlist",
            content.cmdTabWishlist.value,
          ),
          cmd(
            "/wlab performance",
            content.cmdTabPerformance.value,
          ),
          cmd(
            "/wlab snapshots",
            content.cmdTabSnapshots.value,
          ),
          cmd(
            "/wlab loadouts",
            content.cmdTabLoadouts.value,
          ),
          cmd(
            "/wlab import",
            content.cmdTabImport.value,
          ),
          cmd(
            "/wlab settings",
            content.cmdTabSettings.value,
          ),
          cmd(
            "/wlab about",
            content.cmdTabAbout.value,
          ),
        ],
        title: content.groupTabs.value,
      },
      {
        commands: [
          cmd(
            "/wlab wishlist add <itemLink|itemID>",
            content.cmdWishlistAdd.value,
          ),
          cmd(
            "/wlab wishlist remove <itemLink|itemID>",
            content.cmdWishlistRemove.value,
          ),
          cmd(
            "/wlab wishlist list",
            content.cmdWishlistList.value,
          ),
          cmd(
            "/wlab wishlist clear",
            content.cmdWishlistClear.value,
          ),
        ],
        title: content.groupWishlist.value,
      },
      {
        commands: [
          cmd(
            "/wlab scrap",
            content.cmdScrapToggle.value,
          ),
          cmd(
            "/wlab scrap on | off",
            content.cmdScrapSet.value,
          ),
          cmd(
            "/wlab scrap refresh",
            content.cmdScrapRefresh.value,
          ),
          cmd(
            "/wlab scrap disenchant",
            content.cmdScrapDisenchant.value,
          ),
          cmd(
            "/wlab scrap disenchant on | off",
            content.cmdScrapDisenchantSet.value,
          ),
        ],
        title: content.groupScrap.value,
      },
      {
        commands: [
          cmd(
            "/wlab snapshot capture",
            content.cmdSnapshotCapture.value,
          ),
          cmd(
            "/wlab snapshot compare",
            content.cmdSnapshotCompare.value,
          ),
          cmd(
            "/wlab snapshot trend",
            content.cmdSnapshotTrend.value,
          ),
          cmd(
            "/wlab snapshot list",
            content.cmdSnapshotList.value,
          ),
          cmd(
            "/wlab snapshot clear",
            content.cmdSnapshotClear.value,
          ),
        ],
        title: content.groupSnapshots.value,
      },
      {
        commands: [
          cmd(
            "/wlab pick",
            content.cmdPickToggle.value,
          ),
          cmd(
            "/wlab pick on | off",
            content.cmdPickSet.value,
          ),
          cmd(
            "/wlab pick clear",
            content.cmdPickClear.value,
          ),
          cmd(
            "/wlab pick count",
            content.cmdPickCount.value,
          ),
        ],
        title: content.groupSimSelection.value,
      },
      {
        commands: [
          cmd(
            "/wlab layout",
            content.cmdLayoutToggle.value,
          ),
          cmd(
            "/wlab layout reset",
            content.cmdLayoutReset.value,
          ),
        ],
        title: content.groupLayout.value,
      },
    ],
    [content],
  );
}

function cmd(command: string, description: string): CommandRow {
  return { command, description };
}
