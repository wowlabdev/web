import { Text } from "react-email";

import { BrandLayout, ExpiryNote, OtpCode } from "./components/brand-layout";

const token = "{{ .Token }}";

export default function ReauthenticationEmail() {
  return (
    <BrandLayout
      heading="Verify it is you"
      preview="Your WoW Lab verification code"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        Enter this code to confirm a sensitive action on your WoW Lab account.
      </Text>
      <OtpCode code={token} />
      <ExpiryNote>The code is valid for 1 hour.</ExpiryNote>
    </BrandLayout>
  );
}
