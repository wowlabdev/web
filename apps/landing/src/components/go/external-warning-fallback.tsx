import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

// Outside [locale] and excluded from intlayer middleware, so no server i18n.
export function ExternalWarningFallback() {
  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">
            Checking redirect target...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-base">
            Preparing external redirect warning.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
