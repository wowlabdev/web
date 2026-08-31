import type { ReactNode } from "react";

type MdStepProps = {
  children: ReactNode;
  title: string;
  step?: number;
};

type MdStepsProps = {
  children: ReactNode;
};

export function MdStep({ children, step, title }: Readonly<MdStepProps>) {
  return (
    <div className="relative flex gap-4 pb-6">
      <div className="relative flex w-8 shrink-0 flex-col items-center">
        <div className="z-10 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {step}
        </div>
        <div className="absolute bottom-0 top-8 w-0.5 bg-border last:hidden" />
      </div>
      <div className="flex-1 pt-1">
        <div className="mb-1 font-semibold">{title}</div>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function MdSteps({ children }: Readonly<MdStepsProps>) {
  return (
    <div className="my-6 flex flex-col items-stretch gap-0">{children}</div>
  );
}
