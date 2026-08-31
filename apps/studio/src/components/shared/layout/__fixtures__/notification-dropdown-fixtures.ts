import type { MockNotification } from "@/components/shared/layout/notification-dropdown";

export const NOTIFICATION_INBOX_ITEMS: MockNotification[] = [
  {
    id: "inbox-1",
    initials: "MB",
    kind: "post",
    name: "Mark Bush",
    time: { count: 12, unit: "minutes" },
  },
  {
    id: "inbox-2",
    initials: "AB",
    kind: "comment",
    name: "Aaron Black",
    time: { count: 27, unit: "minutes" },
  },
  {
    id: "inbox-3",
    initials: "A",
    kind: "request",
    name: "Anna",
    time: { count: 2, unit: "hours" },
  },
  {
    id: "inbox-4",
    initials: "J",
    kind: "file",
    name: "Jason",
    time: { count: 6, unit: "hours" },
  },
];

export const NOTIFICATION_GENERAL_ITEMS: MockNotification[] = [
  {
    id: "general-1",
    initials: "FC",
    kind: "comment",
    name: "Fred Campbell",
    time: { count: 39, unit: "minutes" },
  },
  {
    id: "general-2",
    initials: "S",
    kind: "file",
    name: "Scott",
    time: { count: 3, unit: "hours" },
  },
  {
    id: "general-3",
    initials: "HL",
    kind: "post",
    name: "Harold Larson",
    time: { count: 5, unit: "hours" },
  },
  {
    id: "general-4",
    initials: "R",
    kind: "request",
    name: "Rosie",
    time: { count: 8, unit: "hours" },
  },
];
