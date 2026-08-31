import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  CircleAlertIcon,
  CircleCheckBigIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { cn } from "@wowlab/shared/lib/utils";

type MdAlertProps = {
  children: ReactNode;
  title?: string;
  type?: MdAlertType;
};

type MdAlertType = "error" | "info" | "note" | "success" | "warning";

const ALERT_TYPES: Record<
  MdAlertType,
  {
    Icon: LucideIcon;
    accent: string;
    iconColor: string;
    variant: "default" | "destructive";
  }
> = {
  error: {
    accent: "",
    Icon: CircleAlertIcon,
    iconColor: "",
    variant: "destructive",
  },
  info: {
    accent: "border-l-2 border-l-sky-500",
    Icon: InfoIcon,
    iconColor: "!text-sky-500",
    variant: "default",
  },
  note: { accent: "", Icon: InfoIcon, iconColor: "", variant: "default" },
  success: {
    accent: "border-l-2 border-l-emerald-500",
    Icon: CircleCheckBigIcon,
    iconColor: "!text-emerald-500",
    variant: "default",
  },
  warning: {
    accent: "border-l-2 border-l-amber-500",
    Icon: TriangleAlertIcon,
    iconColor: "!text-amber-500",
    variant: "default",
  },
};

export function MdAlert({
  children,
  title,
  type = "note",
}: Readonly<MdAlertProps>) {
  const { accent, Icon, iconColor, variant } = ALERT_TYPES[type];

  return (
    <Alert variant={variant} className={cn("my-4", accent)}>
      <Icon className={iconColor || undefined} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
