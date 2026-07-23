import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface DesktopSectionsItemProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}

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
