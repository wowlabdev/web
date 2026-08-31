"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { useLookupUser } from "@/lib/query/services";
import { FormattedDate } from "@wowlab/shared/components/common";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

export function ToolsPage() {
  const content = useIntlayer("admin");
  const userLookup = useLookupUser();

  const [handle, setHandle] = useState("");

  async function handleLookup() {
    const value = handle.trim().toLowerCase();

    if (!value) {
      return;
    }

    await userLookup.mutateAsync(value);
  }

  return (
    <div className="space-y-4">
      {userLookup.error && (
        <Alert variant="destructive">
          <AlertTitle>{content.tools.adminToolFailed}</AlertTitle>
          <AlertDescription>{userLookup.error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="size-4" />
            {content.tools.lookupUser}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="lookup-user-handle">{content.tools.handle}</Label>
            <Input
              id="lookup-user-handle"
              placeholder={content.tools.handle.value}
              value={handle}
              onChange={(event) => {
                setHandle(event.target.value);
                userLookup.reset();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleLookup();
                }
              }}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={!handle.trim() || userLookup.isPending}
            onClick={() => void handleLookup()}
          >
            {userLookup.isPending
              ? content.tools.lookingUp
              : content.tools.lookup}
          </Button>

          {userLookup.isSuccess && userLookup.data === null && (
            <p className="text-muted-foreground text-sm">
              {content.tools.userNotFound}
            </p>
          )}

          {userLookup.data && (
            <div className="space-y-1 text-sm">
              <p>
                {content.tools.userId}:{" "}
                <span className="font-mono">{userLookup.data.id}</span>
              </p>
              <p className="text-muted-foreground">
                {content.tools.created}:{" "}
                <FormattedDate
                  value={userLookup.data.created_at}
                  dateStyle="medium"
                />
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
