import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("canvasPlanner", {
  // apps/studio/src/components/shared/canvas/planner/hint-banner.tsx, apps/studio/src/components/shared/canvas/planner/text-entry-popover.tsx, apps/studio/src/components/shared/canvas/planner/toolbar.tsx
  "addText": "Hinzufügen",
  "annotationColorAriaLabel": "Anmerkungsfarbe",
  "annotationTextPlaceholder": "Anmerkungstext",
  "clearAll": "Alles löschen",
  "exportPng": "Aktuelle Ansicht als PNG exportieren (2x)",
  "hintPathFinishCount": plural({ one: "Doppelklick zum Beenden des Pfads ({{count}} Punkt)", other: "Doppelklick zum Beenden des Pfads ({{count}} Punkte)" }),
  "hintPathRemaining": plural({ one: "Klicke {{count}} weiteren Punkt, um den Pfad zu beenden", other: "Klicke {{count}} weitere Punkte, um den Pfad zu beenden" }),
  "hintPathStart": "Punkte anklicken, Doppelklick zum Beenden",
  "hintPolygonFinishCount": plural({ one: "Doppelklick zum Beenden des Polygons ({{count}} Punkt)", other: "Doppelklick zum Beenden des Polygons ({{count}} Punkte)" }),
  "hintPolygonRemaining": plural({ one: "Klicke {{count}} weiteren Punkt, um das Polygon zu beenden", other: "Klicke {{count}} weitere Punkte, um das Polygon zu beenden" }),
  "hintPolygonStart": "Drei oder mehr Punkte anklicken, Doppelklick zum Beenden",
  "redo": "Wiederholen",
  "setColor": insert("Farbe {{color}} wählen"),
  "toolMarker": "Markierung",
  "toolPath": "Pfad (Doppelklick zum Beenden)",
  "toolPolygon": "Polygon (Doppelklick zum Beenden)",
  "toolSelect": "Auswählen",
  "toolText": "Text",
  "undo": "Rückgängig",
});
