import { cn } from "@wowlab/shared/lib/utils";

export function DemoBox({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "bg-muted/30 flex flex-wrap items-center gap-3 rounded-sm border border-dashed p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DemoSection({
  children,
  className,
  id,
  title,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  id: string;
  title: string;
}>) {
  return (
    <section id={id} className={cn("space-y-4", className)}>
      <h2 className="border-b pb-2 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function DemoSubsection({
  children,
  className,
  title,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-muted-foreground text-xs font-medium uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
