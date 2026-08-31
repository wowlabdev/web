import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("userProfile", {
  // apps/studio/src/components/account/users/user-profile-content.tsx, apps/studio/src/components/account/users/user-profile-not-found.tsx
  "avatarAlt": insert("Avatar von {{handle}}"),
  "noRotationsDescription": insert("@{{handle}} hat noch keine Rotationen veröffentlicht."),
  "noRotationsTitle": "Keine öffentlichen Rotationen",
  "notFoundDescription": insert("@{{handle}} existiert nicht"),
  "notFoundTitle": "Benutzer nicht gefunden",
  "publicRotationsTitle": "Öffentliche Rotationen",
  "rotationsCount": plural({ one: "{{count}} Rotation", other: "{{count}} Rotationen" }),
});
