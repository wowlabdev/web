import {
  BookMarkedIcon,
  BookOpenIcon,
  FileTextIcon,
  NewspaperIcon,
  PackageIcon,
  SparklesIcon,
} from "lucide-react";

export const FILTERS = [
  { icon: FileTextIcon, key: "Pages" },
  { icon: BookOpenIcon, key: "Docs" },
  { icon: BookMarkedIcon, key: "Bible" },
  { icon: NewspaperIcon, key: "Blog" },
  { icon: SparklesIcon, key: "Spells" },
  { icon: PackageIcon, key: "Items" },
] as const;

export type FilterKey = (typeof FILTERS)[number]["key"];

export const CATEGORY_ICONS: Record<string, typeof FileTextIcon> = {
  Bible: BookMarkedIcon,
  Blog: NewspaperIcon,
  Docs: BookOpenIcon,
  Pages: FileTextIcon,
};
