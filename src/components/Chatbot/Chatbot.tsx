import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatBody } from './ChatBody';
import { SuggestedActions } from './SuggestedActions';
import { PromptContainer } from './PromptContainer';
import { ChatFooter } from './ChatFooter';
import { useChatbot } from './useChatbot';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage, startNewChat } = useChatbot();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSelectAction = (text: string) => {
    void sendMessage(text);
  };

  const handlePromptSubmit = (text: string) => {
    void sendMessage(text);
  };

  return (
    <>
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

      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-32px)] h-[440px] max-h-[440px] flex flex-col bg-frui-white border border-frui-blue/10 rounded-2xl shadow-xl overflow-hidden"
        >
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onNewChat={startNewChat}
          />

          <ChatBody>
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-4 scrollbar-none"
            >
              {messages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed select-text whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-frui-blue text-frui-white self-end rounded-tr-none'
                          : 'bg-frui-white text-frui-blue border border-frui-blue/10 self-start rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed bg-frui-white text-frui-blue/70 border border-frui-blue/10 self-start rounded-tl-none">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-frui-orange" />
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>
              ) : (
                <SuggestedActions onSelectAction={handleSelectAction} />
              )}
            </div>

            <PromptContainer
              onSubmit={handlePromptSubmit}
              disabled={isLoading}
            />
          </ChatBody>

          <ChatFooter />
        </div>
      )}
    </>
  );
}
