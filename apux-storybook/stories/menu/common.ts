export type Item = {
  label: string;
  icon?: string;
  link?: string;
  divider?: boolean;
  header?: string;
  disabled?: boolean;
  selected?: boolean;
  submenu?: Item[];
};

export const menuItems: Item[] = [
  { label: "File" },
  { label: "Edit" },
  { label: "View" },
  { label: "Tools" },
  { label: "Help" },
];
