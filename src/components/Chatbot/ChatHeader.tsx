import { Menu, SquarePen, X } from 'lucide-react';
import { ActionGroup } from './ActionGroup';

interface ChatHeaderProps {
  onClose: () => void;
  onNewChat?: () => void;
}

/**
 * ChatHeader component that displays the chatbot brand/logo,
 * navigation menu, edit/new-chat button, and close controls.
 */
export function ChatHeader({ onClose, onNewChat }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full px-4 py-3 border-b border-frui-blue/10 bg-frui-white rounded-t-2xl">
      {/* Left Action Group: Menu and Brand Logo/Text */}
      <ActionGroup gap="sm">
        <button
          type="button"
          aria-label="Open menu"
          className="text-frui-blue focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1">
          {/* Brand/logo text Frui */}
          <span className="font-bold text-lg bg-gradient-to-r from-frui-orange to-[#ff9900] bg-clip-text text-transparent select-none">
            Frui
          </span>
          <span className="text-xs font-semibold text-frui-blue/50 select-none">
            Assistant
          </span>
        </div>
      </ActionGroup>

      {/* Right Action Group: Edit/New Chat and Close Button */}
      <ActionGroup gap="sm">
        <button
          type="button"
          onClick={onNewChat}
          aria-label="Start new chat"
          className="text-frui-blue/60 focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
        >
          <SquarePen className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chatbot"
          className="text-frui-blue/60 focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
        >
          <X className="h-5 w-5" />
        </button>
      </ActionGroup>
    </div>
  );
}
