import {
  SidebarFooter,
  SidebarMenu,
  SidebarSeparator,
} from "@wowlab/shared/components/ui/sidebar";

import { ActiveCharacterIndicator } from "./active-character-indicator";
import { SystemStatusIndicator } from "./system-status-indicator";

export function DashboardSidebarFooter() {
  return (
    <SidebarFooter className="group-data-[collapsible=icon]:hidden">
      <SidebarSeparator className="mx-0" />
      <SidebarMenu id="tour-engine-status">
        <ActiveCharacterIndicator />
        <SystemStatusIndicator />
      </SidebarMenu>
    </SidebarFooter>
  );
}
