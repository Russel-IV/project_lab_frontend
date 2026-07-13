import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface MobileSectionsItemProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
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
 * @param props.disabled - Disables and grays out the tab (not yet available).
 */
export const MobileSectionsItem: React.FC<MobileSectionsItemProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide select-none whitespace-nowrap transition-colors duration-150 ${
        disabled
          ? 'cursor-not-allowed bg-frui-white border-frui-blue/10 text-frui-blue/30'
          : 'cursor-pointer'
      } ${
        !disabled && active
          ? 'bg-frui-orange border-frui-orange text-frui-white'
          : ''
      } ${
        !disabled && !active
          ? 'bg-frui-white border-frui-blue/10 text-frui-blue/70'
          : ''
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  );
};
