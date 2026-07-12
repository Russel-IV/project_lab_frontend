import { Plane, Compass, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SuggestedAction {
  id: string;
  text: string;
  icon: LucideIcon;
}

interface SuggestedActionsProps {
  onSelectAction: (text: string) => void;
}

const ACTIONS: SuggestedAction[] = [
  {
    id: 'flight',
    text: 'How can I book a flight?',
    icon: Plane,
  },
  {
    id: 'todo',
    text: 'What things can I do?',
    icon: Compass,
  },
  {
    id: 'general',
    text: 'Are there any stays near my location?',
    icon: HelpCircle,
  },
];

/**
 * SuggestedActions component displaying pre-prompt suggestions
 * in a flexbox column layout.
 */
export function SuggestedActions({ onSelectAction }: SuggestedActionsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {ACTIONS.map((action) => {
        const IconComponent = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelectAction(action.text)}
            aria-label={`Ask: ${action.text}`}
            className="flex items-center justify-start gap-3 w-full px-4 py-3 bg-frui-white border border-frui-blue/10 rounded-xl text-left text-sm text-frui-blue focus:outline-none cursor-pointer"
          >
            <span className="flex-shrink-0 text-frui-orange">
              <IconComponent className="h-5 w-5" />
            </span>
            <span className="font-medium text-frui-blue/90">{action.text}</span>
          </button>
        );
      })}
    </div>
  );
}
