"use client";

import { useSpecList } from "@/lib/game-data";
import { useUserProfile } from "@/lib/query/services";

import { UserProfileContent } from "./user-profile-content";
import { UserProfileNotFound } from "./user-profile-not-found";
import { UserProfileSkeleton } from "./user-profile-skeleton";

type UserProfilePageProps = {
  handle: string;
};

export function UserProfilePage({ handle }: Readonly<UserProfilePageProps>) {
  const { data: profile, isLoading, notFound } = useUserProfile(handle);
  const { data: specs } = useSpecList();

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (notFound || !profile) {
    return <UserProfileNotFound handle={handle} />;
  }

  return (
    <UserProfileContent
      handle={handle}
      profile={profile}
      rotations={profile.rotations}
      specs={specs}
    />
  );
}
