import { API_ENDPOINTS } from '@/config/api';

/**
 * Interface representing the chat API request payload.
 */
export interface ChatRequest {
  message: string;
  sessionId: string;
}

/**
 * Interface representing the chat API response payload.
 */
export interface ChatResponse {
  response: string;
}

/**
 * Sends a user message to the chatbot service REST API.
 *
 * @param message - The user prompt string.
 * @param sessionId - The ephemeral session identifier.
 * @returns Promise resolving to the assistant's response payload.
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
): Promise<ChatResponse> {
  const res = await fetch(API_ENDPOINTS.CHAT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    throw new Error(`Chat API request failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Sends a request to explicitly purge an ephemeral chat session from backend memory.
 *
 * @param sessionId - The session identifier to clear.
 */
export async function clearChatSession(sessionId: string): Promise<void> {
  if (!sessionId) return;
  try {
    await fetch(`${API_ENDPOINTS.CHAT}/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    // Non-blocking error handling for session cleanup
    console.error('Failed to clear chat session on backend:', err);
  }
}
