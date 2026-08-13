import { useState, useRef, useEffect, useCallback } from 'react';
import {
  sendChatMessage,
  clearChatSession,
  type StaySummary,
} from '@/api/chat';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Interface representing a chat message in the UI.
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  stays?: StaySummary[];
}

/**
 * Custom hook to manage ephemeral chatbot session lifecycle, messages, loading state,
 * and Strategy A explicit session cleanup on reset or page unload.
 *
 * @returns State and actions for the Chatbot component.
 */
export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());

  const sessionIdRef = useRef<string>(sessionId);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  /**
   * Clears the current session on the backend and resets local state with a new sessionId.
   */
  const startNewChat = useCallback(() => {
    const oldSessionId = sessionIdRef.current;
    if (oldSessionId) {
      // Fire Strategy A explicit session cleanup
      clearChatSession(oldSessionId);
    }

    const newId = crypto.randomUUID();
    sessionIdRef.current = newId;
    setSessionId(newId);
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Sends a user message to the chatbot service and appends the response.
   *
   * @param text - The message text typed by the user.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        text: trimmedText,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const data = await sendChatMessage(trimmedText, sessionIdRef.current);
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: data.response,
          stays: data.stays,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unable to communicate with assistant';
        setError(errorMessage);
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: 'I am having trouble connecting right now. Please check your connection and try again.',
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  // Strategy A cleanup on tab close / refresh using fetch keepalive
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentSessionId = sessionIdRef.current;
      if (currentSessionId) {
        const url = `${API_ENDPOINTS.CHAT}/${encodeURIComponent(currentSessionId)}`;
        try {
          fetch(url, { method: 'DELETE', keepalive: true });
        } catch {
          // Ignore unload fetch errors
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    sessionId,
    messages,
    isLoading,
    error,
    sendMessage,
    startNewChat,
  };
}
