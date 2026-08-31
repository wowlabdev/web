import { useIntlayer } from "next-intlayer/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { AuthLines } from "./auth-lines";
import { SignInAgreement } from "./sign-in-agreement";
import { SignInDivider } from "./sign-in-divider";
import { SignInPanel } from "./sign-in-panel";

type SignInCardProps = {
  redirectTo: string | undefined;
};

export function SignInCard({ redirectTo }: Readonly<SignInCardProps>) {
  const content = useIntlayer("signIn");

  return (
    <Card className="relative w-full max-w-md overflow-hidden border-none pt-12 shadow-lg">
      <div className="to-primary/10 pointer-events-none absolute top-0 h-52 w-full rounded-t-xl bg-gradient-to-t from-transparent" />
      <AuthLines />

      <CardHeader className="gap-6 text-center">
        <div>
          <CardTitle className="mb-1.5 text-2xl">{content.title}</CardTitle>
          <CardDescription className="text-base">
            {content.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <SignInPanel
          redirectTo={redirectTo}
          divider={<SignInDivider />}
          agreement={<SignInAgreement />}
        />
      </CardContent>
    </Card>
  );
}
