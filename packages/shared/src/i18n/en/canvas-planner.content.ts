import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("canvasPlanner", {
  // apps/studio/src/components/shared/canvas/planner/hint-banner.tsx, apps/studio/src/components/shared/canvas/planner/text-entry-popover.tsx, apps/studio/src/components/shared/canvas/planner/toolbar.tsx
  "addText": "Add",
  "annotationColorAriaLabel": "Annotation color",
  "annotationTextPlaceholder": "Annotation text",
  "clearAll": "Clear all",
  "exportPng": "Export current view as PNG (2x)",
  "hintPathFinishCount": plural({ one: "Double-click to finish path ({{count}} point)", other: "Double-click to finish path ({{count}} points)" }),
  "hintPathRemaining": plural({ one: "Click {{count}} more point to finish path", other: "Click {{count}} more points to finish path" }),
  "hintPathStart": "Click points, double-click to finish",
  "hintPolygonFinishCount": plural({ one: "Double-click to finish polygon ({{count}} point)", other: "Double-click to finish polygon ({{count}} points)" }),
  "hintPolygonRemaining": plural({ one: "Click {{count}} more point to finish polygon", other: "Click {{count}} more points to finish polygon" }),
  "hintPolygonStart": "Click 3+ points, double-click to finish",
  "redo": "Redo",
  "setColor": insert("Set color {{color}}"),
  "toolMarker": "Marker",
  "toolPath": "Path (double-click to finish)",
  "toolPolygon": "Polygon (double-click to finish)",
  "toolSelect": "Select",
  "toolText": "Text",
  "undo": "Undo",
});
