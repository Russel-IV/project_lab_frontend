import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useChatbot } from './useChatbot';
import * as chatApi from '@/api/chat';

vi.mock('@/api/chat', () => ({
  sendChatMessage: vi.fn(),
  clearChatSession: vi.fn(),
}));

describe('useChatbot hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with a valid sessionId and empty messages', () => {
    const { result } = renderHook(() => useChatbot());
    expect(result.current.sessionId).toBeDefined();
    expect(typeof result.current.sessionId).toBe('string');
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sends user message and appends assistant response', async () => {
    vi.mocked(chatApi.sendChatMessage).mockResolvedValueOnce({
      response: 'Hello! I can help you find hotel stays.',
    });

    const { result } = renderHook(() => useChatbot());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(chatApi.sendChatMessage).toHaveBeenCalledWith(
      'Hello',
      result.current.sessionId,
    );
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toMatchObject({
      sender: 'user',
      text: 'Hello',
    });
    expect(result.current.messages[1]).toMatchObject({
      sender: 'assistant',
      text: 'Hello! I can help you find hotel stays.',
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('handles API error gracefully and appends error fallback message', async () => {
    vi.mocked(chatApi.sendChatMessage).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useChatbot());

    await act(async () => {
      await result.current.sendMessage('Search hotels');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].text).toContain(
      'I am having trouble connecting right now',
    );
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('clears messages and regenerates sessionId on startNewChat (Strategy A)', async () => {
    vi.mocked(chatApi.sendChatMessage).mockResolvedValueOnce({
      response: 'Sure thing!',
    });

    const { result } = renderHook(() => useChatbot());
    const initialSessionId = result.current.sessionId;

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.startNewChat();
    });

    expect(chatApi.clearChatSession).toHaveBeenCalledWith(initialSessionId);
    expect(result.current.messages).toEqual([]);
    expect(result.current.sessionId).not.toBe(initialSessionId);
  });
});
