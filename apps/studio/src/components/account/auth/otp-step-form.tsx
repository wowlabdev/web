import { type ReactNode } from "react";

import { FieldGroup } from "@wowlab/shared/components/ui/field";

type OtpStepFormProps = {
  children: ReactNode;
  onSubmit: () => void;
};

export function OtpStepForm({
  children,
  onSubmit,
}: Readonly<OtpStepFormProps>) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSubmit();
      }}
    >
      <FieldGroup>{children}</FieldGroup>
    </form>
  );
}
