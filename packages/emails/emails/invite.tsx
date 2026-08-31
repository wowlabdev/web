import { Text } from "react-email";

import {
  ActionButton,
  BrandLayout,
  ExpiryNote,
  FallbackLink,
} from "./components/brand-layout";

const confirmationUrl = "{{ .ConfirmationURL }}";

export default function InviteEmail() {
  return (
    <BrandLayout
      heading="You are invited to WoW Lab"
      preview="You have been invited to WoW Lab"
    >
      <Text className="m-0 text-[14px] leading-[22px] text-foreground">
        You have an invitation to WoW Lab. Accept it to create your account.
      </Text>
      <ActionButton href={confirmationUrl}>Accept invite</ActionButton>
      <FallbackLink href={confirmationUrl} />
      <ExpiryNote>The invite link is valid for 1 hour.</ExpiryNote>
    </BrandLayout>
  );
}
