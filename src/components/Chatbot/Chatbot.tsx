import { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { SuggestedActions } from './SuggestedActions';
import { PromptContainer } from './PromptContainer';
import { ChatFooter } from './ChatFooter';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

/**
 * Chatbot component that acts as the main floating chat assistant widget.
 * Manages the visibility toggle, context display state, message history,
 * and scrolls to the bottom when new messages arrive.
 */
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat messages container to bottom when messages update
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSelectAction = (text: string) => {
    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    // Simulate assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Thanks for asking about "${text}"! We are currently working on this feature.`,
        },
      ]);
    }, 600);
  };

  const handlePromptSubmit = (text: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `You said: "${text}". The AI booking assistant is currently under development.`,
        },
      ]);
    }, 600);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-frui-orange text-frui-white shadow-lg flex items-center justify-center focus:outline-none cursor-pointer border-0"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Floating Chat Window Layout */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[440px] max-h-[440px] flex flex-col bg-frui-white border border-frui-blue/10 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onNewChat={handleNewChat}
          />

          {/* Body Container */}
          <ChatBody>
            {/* Scrollable area for messages and suggestions */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-4 scrollbar-none"
            >
              {messages.length > 0 ? (
                /* Scrollable Message List */
                <div className="flex flex-col gap-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed select-text ${
                        msg.sender === 'user'
                          ? 'bg-frui-blue text-frui-white self-end rounded-tr-none'
                          : 'bg-frui-white text-frui-blue border border-frui-blue/5 self-start rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              ) : (
                /* Suggested Pre-Prompts */
                <SuggestedActions onSelectAction={handleSelectAction} />
              )}
            </div>

            {/* User Input & Toolbar */}
            <PromptContainer onSubmit={handlePromptSubmit} />
          </ChatBody>

          {/* Footer Safety Disclaimer */}
          <ChatFooter />
        </div>
      )}
    </>
  );
}
