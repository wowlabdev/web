import { Text } from "react-email";

import { BrandLayout, ExpiryNote, OtpCode } from "./components/brand-layout";

const token = "{{ .Token }}";

export default function ConfirmationEmail() {
  return (
    <BrandLayout
      heading="Confirm your email"
      preview="Confirm your email to finish setting up WoW Lab"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        Welcome to WoW Lab. Enter this code to confirm your email and activate
        your account.
      </Text>
      <OtpCode code={token} />
      <ExpiryNote>The code is valid for 1 hour.</ExpiryNote>
    </BrandLayout>
  );
}
