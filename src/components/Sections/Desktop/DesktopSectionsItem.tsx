import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface DesktopSectionsItemProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}

/**
 * DesktopSectionsItem
 *
 * Individual category tab button for desktop view.
 * Uses styling from Sections.css (.form-tab-btn).
 *
 * @param props.active - Indicated if the tab is currently active.
 * @param props.onClick - Click event handler.
 * @param props.icon - LucideIcon component to render.
 * @param props.label - Text label for the category.
 * @param props.disabled - Disables and grays out the tab (not yet available).
 */
export const DesktopSectionsItem: React.FC<DesktopSectionsItemProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`form-tab-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Icon className="form-tab-icon" strokeWidth={active ? 2 : 1.5} />
      <span className="form-tab-text">{label}</span>
    </button>
  );
};
