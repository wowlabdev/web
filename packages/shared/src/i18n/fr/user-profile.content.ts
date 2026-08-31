import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("userProfile", {
  // apps/studio/src/components/account/users/user-profile-content.tsx, apps/studio/src/components/account/users/user-profile-not-found.tsx
  "avatarAlt": insert("Avatar de {{handle}}"),
  "noRotationsDescription": insert("@{{handle}} n'a pas encore publié de rotations."),
  "noRotationsTitle": "Aucune rotation publique",
  "notFoundDescription": insert("@{{handle}} n'existe pas"),
  "notFoundTitle": "Utilisateur introuvable",
  "publicRotationsTitle": "Rotations publiques",
  "rotationsCount": plural({ one: "{{count}} rotation", other: "{{count}} rotations" }),
});
