import React from 'react';

interface ChatBodyProps {
  children: React.ReactNode;
}

export function ChatBody({ children }: ChatBodyProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4 bg-frui-cream overflow-hidden">
      {children}
    </div>
  );
}
