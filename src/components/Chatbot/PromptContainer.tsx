import React, { useRef, useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUp } from 'lucide-react';
import { ActionGroup } from './ActionGroup';

interface PromptContainerProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function PromptContainer({
  onSubmit,
  disabled = false,
}: PromptContainerProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Min 2 lines (48px), Max 4 lines (88px) for text-sm leading-5 with pb-2
      const minHeight = 48;
      const maxHeight = 88;
      const targetHeight = Math.max(
        minHeight,
        Math.min(scrollHeight, maxHeight),
      );
      textarea.style.height = `${targetHeight}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [inputValue]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col w-full bg-frui-white border border-frui-blue/10 rounded-2xl p-3 shadow-sm">
      <textarea
        ref={textareaRef}
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled
            ? 'Assistant is thinking...'
            : 'Write a prompt asking about anything of the application'
        }
        rows={2}
        className="w-full text-sm leading-5 text-frui-blue placeholder:text-frui-blue/40 bg-transparent resize-none border-0 outline-none focus:ring-0 focus:outline-none scrollbar-none pb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Chatbot prompt input"
      />

      <div className="flex justify-between items-center w-full border-t border-frui-blue/5 pt-2">
        <ActionGroup gap="md">
          <button
            type="button"
            aria-label="Prompt configuration settings"
            disabled={disabled}
            className="text-frui-blue/60 focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </ActionGroup>

        <ActionGroup gap="md">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Send prompt"
            disabled={disabled || !inputValue.trim()}
            className={`flex items-center justify-center p-2 rounded-xl text-frui-white focus:outline-none cursor-pointer ${
              !disabled && inputValue.trim()
                ? 'bg-frui-orange'
                : 'bg-frui-orange/50 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </ActionGroup>
      </div>
    </div>
  );
}
