import React from 'react';

interface ChatBodyProps {
  children: React.ReactNode;
}

/**
 * ChatBody component representing the content container.
 * Configured as a non-scrolling flexbox column.
 */
export function ChatBody({ children }: ChatBodyProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4 bg-frui-cream overflow-hidden">
      {children}
    </div>
  );
}
