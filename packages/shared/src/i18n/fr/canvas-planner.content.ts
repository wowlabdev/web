import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("canvasPlanner", {
  // apps/studio/src/components/shared/canvas/planner/hint-banner.tsx, apps/studio/src/components/shared/canvas/planner/text-entry-popover.tsx, apps/studio/src/components/shared/canvas/planner/toolbar.tsx
  "addText": "Ajouter",
  "annotationColorAriaLabel": "Couleur d'annotation",
  "annotationTextPlaceholder": "Texte d'annotation",
  "clearAll": "Tout effacer",
  "exportPng": "Exporter la vue actuelle en PNG (2x)",
  "hintPathFinishCount": plural({ one: "Double-cliquez pour terminer le tracé ({{count}} point)", other: "Double-cliquez pour terminer le tracé ({{count}} points)" }),
  "hintPathRemaining": plural({ one: "Cliquez {{count}} point supplémentaire pour terminer le tracé", other: "Cliquez {{count}} points supplémentaires pour terminer le tracé" }),
  "hintPathStart": "Cliquez les points, double-cliquez pour terminer",
  "hintPolygonFinishCount": plural({ one: "Double-cliquez pour terminer le polygone ({{count}} point)", other: "Double-cliquez pour terminer le polygone ({{count}} points)" }),
  "hintPolygonRemaining": plural({ one: "Cliquez {{count}} point supplémentaire pour terminer le polygone", other: "Cliquez {{count}} points supplémentaires pour terminer le polygone" }),
  "hintPolygonStart": "Cliquez 3 points ou plus, double-cliquez pour terminer",
  "redo": "Rétablir",
  "setColor": insert("Choisir la couleur {{color}}"),
  "toolMarker": "Marqueur",
  "toolPath": "Tracé (double-clic pour terminer)",
  "toolPolygon": "Polygone (double-clic pour terminer)",
  "toolSelect": "Sélectionner",
  "toolText": "Texte",
  "undo": "Annuler",
});
