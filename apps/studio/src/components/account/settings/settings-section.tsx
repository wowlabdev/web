import type { ReactNode } from "react";

type SettingsSectionProps = {
  children: ReactNode;
  description: ReactNode;
  title: ReactNode;
};

export function SettingsSection({
  children,
  description,
  title,
}: Readonly<SettingsSectionProps>) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="lg:col-span-2">{children}</div>
    </div>
  );
}
