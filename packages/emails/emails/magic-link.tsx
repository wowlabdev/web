import { Text } from "react-email";

import { BrandLayout, ExpiryNote, OtpCode } from "./components/brand-layout";

const token = "{{ .Token }}";

export default function MagicLinkEmail() {
  return (
    <BrandLayout
      heading="Sign in to WoW Lab"
      preview="Your WoW Lab sign-in code"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        Enter this code to sign in to WoW Lab.
      </Text>
      <OtpCode code={token} />
      <ExpiryNote>
        The code is valid for 1 hour and can only be used once.
      </ExpiryNote>
    </BrandLayout>
  );
}
