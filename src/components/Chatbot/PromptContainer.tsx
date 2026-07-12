import React, { useRef, useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUp } from 'lucide-react';
import { ActionGroup } from './ActionGroup';

interface PromptContainerProps {
  onSubmit: (text: string) => void;
}

/**
 * PromptContainer component containing the custom text input
 * and action toolbar for settings, submission, and model selection.
 */
export function PromptContainer({ onSubmit }: PromptContainerProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Limit max-height to 96px (approx 4 lines)
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 96)}px`;
    }
  }, [inputValue]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
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
      {/* PromptInput: Auto-resizing textarea */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a prompt asking about anything of the application"
        rows={1}
        className="w-full text-sm text-frui-blue placeholder:text-frui-blue/40 bg-transparent resize-none border-0 outline-none focus:ring-0 focus:outline-none scrollbar-none pb-2"
        aria-label="Chatbot prompt input"
      />

      {/* PromptToolbar: Flexbox row */}
      <div className="flex justify-between items-center w-full border-t border-frui-blue/5 pt-2">
        {/* Left Action Group: settings and upload buttons */}
        <ActionGroup gap="md">
          <button
            type="button"
            aria-label="Prompt configuration settings"
            className="text-frui-blue/60 focus:outline-none cursor-pointer flex items-center justify-center p-1 rounded-md"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </ActionGroup>

        {/* Right Action Group: model selector and submit buttons */}
        <ActionGroup gap="md">
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Send prompt"
            disabled={!inputValue.trim()}
            className={`flex items-center justify-center p-2 rounded-xl text-frui-white focus:outline-none cursor-pointer ${
              inputValue.trim()
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
