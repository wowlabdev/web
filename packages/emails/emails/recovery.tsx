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

export default function RecoveryEmail() {
  return (
    <BrandLayout
      heading="Reset your password"
      preview="Reset your WoW Lab password"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        Someone asked to reset the password on your WoW Lab account. Pick a new
        one below.
      </Text>
      <ActionButton href={confirmationUrl}>Reset password</ActionButton>
      <OtpCode code={token} />
      <FallbackLink href={confirmationUrl} />
      <ExpiryNote>
        The link and code are valid for 1 hour. Until you finish, your password
        stays the same.
      </ExpiryNote>
    </BrandLayout>
  );
}
