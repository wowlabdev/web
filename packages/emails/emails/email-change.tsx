import { Text } from "react-email";

import {
  ActionButton,
  BrandLayout,
  ExpiryNote,
  FallbackLink,
  OtpCode,
} from "./components/brand-layout";

const confirmationUrl = "{{ .ConfirmationURL }}";
const token = "{{ .Token }}";
const oldEmail = "{{ .Email }}";
const newEmail = "{{ .NewEmail }}";

export default function EmailChangeEmail() {
  return (
    <BrandLayout
      heading="Confirm your new email"
      preview="Confirm your new email for WoW Lab"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        Confirm the change of your WoW Lab email from {oldEmail} to {newEmail}.
      </Text>
      <ActionButton href={confirmationUrl}>Confirm change</ActionButton>
      <OtpCode code={token} />
      <FallbackLink href={confirmationUrl} />
      <ExpiryNote>The link and code are valid for 1 hour.</ExpiryNote>
    </BrandLayout>
  );
}
