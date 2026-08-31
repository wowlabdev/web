"use client";

import { useIntlayer } from "next-intlayer";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

type UserProfileNotFoundProps = {
  handle: string;
};

export function UserProfileNotFound({
  handle,
}: Readonly<UserProfileNotFoundProps>) {
  const content = useIntlayer("userProfile");

  return (
    <Card className="px-5 py-12 text-center">
      <CardHeader>
        <CardTitle>{content.notFoundTitle}</CardTitle>
        <CardDescription>
          {content.notFoundDescription({ handle })}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
