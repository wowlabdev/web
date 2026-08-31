import { UserProfilePage } from "@/components/account/users";

type UserProfileProps = {
  params: Promise<{ handle: string }>;
};

export default async function UserProfile({
  params,
}: Readonly<UserProfileProps>) {
  const { handle } = await params;

  return <UserProfilePage handle={handle} />;
}
