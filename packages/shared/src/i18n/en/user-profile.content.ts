import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("userProfile", {
  // apps/studio/src/components/account/users/user-profile-content.tsx, apps/studio/src/components/account/users/user-profile-not-found.tsx
  "avatarAlt": insert("{{handle}}'s avatar"),
  "noRotationsDescription": insert("@{{handle}} has not published any rotations yet."),
  "noRotationsTitle": "No public rotations",
  "notFoundDescription": insert("@{{handle}} does not exist"),
  "notFoundTitle": "User not found",
  "publicRotationsTitle": "Public Rotations",
  "rotationsCount": plural({ one: "{{count}} rotation", other: "{{count}} rotations" }),
});
