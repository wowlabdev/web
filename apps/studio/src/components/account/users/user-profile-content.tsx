"use client";

import { Code2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { Row, Spec } from "@wowlab/shared/lib/supabase/types";

import { FormattedDate } from "@wowlab/shared/components/common";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";
type ProfileRotation = Pick<
  Row<"rotations">,
  "id" | "name" | "spec_id" | "updated_at"
>;
type ProfileSpec = Pick<Spec, "class_name" | "id" | "name">;
type UserProfileContentProps = {
  handle: string;
  profile: Row<"user_profiles">;
  rotations: ProfileRotation[];
  specs: ProfileSpec[] | undefined;
};

export function UserProfileContent({
  handle,
  profile,
  rotations,
  specs,
}: Readonly<UserProfileContentProps>) {
  const content = useIntlayer("userProfile");
  const initials = profile.handle.slice(0, 2).toUpperCase();
  const rotationCount = rotations.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {profile.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={content.avatarAlt({ handle: profile.handle }).value}
              />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Link
            href={href(routes.users.profile, { handle: profile.handle })}
            className="text-xl font-semibold hover:text-primary transition-colors"
          >
            @{profile.handle}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Code2Icon className="size-4" />
          <span className="font-medium tabular-nums">
            {content.rotationsCount(rotationCount)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          {content.publicRotationsTitle}
        </h2>

        {rotations.length > 0 ? (
          <div className="flex flex-col gap-2">
            {rotations.map((rotation) => (
              <Link
                key={rotation.id}
                href={href(routes.rotations.view, { id: rotation.id })}
                className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors no-underline"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{rotation.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSpecLabel(specs, rotation.spec_id)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  <FormattedDate value={rotation.updated_at} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="px-5 py-12 text-center">
            <CardHeader>
              <CardTitle className="text-base">
                {content.noRotationsTitle}
              </CardTitle>
              <CardDescription>
                {content.noRotationsDescription({ handle })}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

function formatSpecLabel(specs: ProfileSpec[] | undefined, specId: number) {
  const spec = specs?.find((s) => s.id === specId);

  return spec ? `${spec.name} ${spec.class_name}` : "";
}
