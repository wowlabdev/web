import { GameIcon } from "@/components/shared/game/game-icon";
import { Link } from "@wowlab/shared/components/ui/link";
import { makeInspectSpellUrl } from "@wowlab/shared/lib/links";

type SpellLinkProps = {
  iconName?: null | string;
  id: number;
  name?: string;
};

export function SpellLink({ iconName, id, name }: Readonly<SpellLinkProps>) {
  return (
    <Link
      href={makeInspectSpellUrl(id)}
      className="inline-flex items-center gap-1.5 hover:underline"
    >
      {iconName ? <GameIcon iconName={iconName} size="sm" alt={name} /> : null}
      {name ? <span>{name}</span> : null}
      <span className="text-muted-foreground text-xs">#{id}</span>
    </Link>
  );
}
