import { cn } from "@wowlab/shared/lib/utils";

const TONE_CLASSES = {
  danger: "bg-red-500",
  muted: "bg-muted-foreground/40",
  pending: "bg-amber-500",
  success: "bg-green-500",
} as const;

export type StatusTone = keyof typeof TONE_CLASSES;

type StatusDotProps = {
  className?: string;
  isPulsing?: boolean;
  title?: string;
  tone: StatusTone;
};

export function StatusDot({
  className,
  isPulsing,
  title,
  tone,
}: Readonly<StatusDotProps>) {
  return (
    <span
      title={title}
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE_CLASSES[tone],
        isPulsing && "animate-pulse",
        className,
      )}
    />
  );
}
