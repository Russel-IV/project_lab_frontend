import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface MobileSectionsItemProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

/**
 * MobileSectionsItem
 *
 * An individual category button representing a section tab on mobile.
 * Designed with pill-shaped rounded border and icon support.
 * Does not include any hover animation (as per project rules).
 *
 * @param props.active - Indicated if the tab is currently active.
 * @param props.onClick - Event handler triggered when the button is clicked.
 * @param props.icon - LucideIcon to display next to the label.
 * @param props.label - Text label for the category.
 */
export const MobileSectionsItem: React.FC<MobileSectionsItemProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide select-none cursor-pointer whitespace-nowrap transition-colors duration-150 ${
        active
          ? 'bg-frui-orange border-frui-orange text-frui-white'
          : 'bg-frui-white border-frui-blue/10 text-frui-blue/70'
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  );
};
