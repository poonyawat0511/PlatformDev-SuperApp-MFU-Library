// utils/iconLoader.ts
import * as Icons from "@heroicons/react/24/outline";

// Define a type for icon names
type IconNames = keyof typeof Icons;

// Utility function to load an icon dynamically
export const loadIcon = (iconName: string) => {
  const formattedIconName = `${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}Icon` as IconNames;
  return Icons[formattedIconName] || null; // Return the icon component or null if not found
};
