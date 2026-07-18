'use client';

import * as React from 'react';

import type { NovaMessage, NovaToolCall } from '@nyvora/types';

interface NovaContextType {
  messages: NovaMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  conversationId: string | null;
  loadConversation: (id: string) => Promise<void>;
}

const NovaContext = React.createContext<NovaContextType | undefined>(undefined);

export function NovaProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<NovaMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [conversationId, setConversationId] = React.useState<string | null>(null);

  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: NovaMessage = {
        id: `msg_${Date.now()}`,
        type: 'user',
        content: content.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setIsStreaming(true);

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch('/api/v1/ai/nova/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            message: content,
            conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al enviar mensaje');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantMessage: NovaMessage = {
            id: `msg_${Date.now() + 1}`,
            type: 'assistant',
            content: '',
            createdAt: new Date(),
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter((line) => line.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);

                if (data.type === 'text') {
                  assistantMessage.content += data.content;
                  setMessages((prev) => {
                    const filtered = prev.filter((m) => m.id !== assistantMessage.id);
                    return [...filtered, { ...assistantMessage }];
                  });
                } else if (data.type === 'tool_call') {
                  const toolCall: NovaToolCall = {
                    id: data.id,
                    name: data.name,
                    arguments: data.arguments,
                    status: 'executing',
                    startedAt: new Date(),
                  };

                  assistantMessage.toolCalls = [
                    ...(assistantMessage.toolCalls || []),
                    toolCall,
                  ];

                  setMessages((prev) => {
                    const filtered = prev.filter((m) => m.id !== assistantMessage.id);
                    return [...filtered, { ...assistantMessage }];
                  });
                } else if (data.type === 'tool_result') {
                  assistantMessage.toolCalls = (assistantMessage.toolCalls || []).map((tc) =>
                    tc.id === data.toolCallId
                      ? {
                          ...tc,
                          status: data.success ? 'completed' : 'failed',
                          result: data.result,
                          error: data.error,
                          completedAt: new Date(),
                        }
                      : tc
                  );

                  setMessages((prev) => {
                    const filtered = prev.filter((m) => m.id !== assistantMessage.id);
                    return [...filtered, { ...assistantMessage }];
                  });
                } else if (data.type === 'conversation_id') {
                  setConversationId(data.conversationId);
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
        console.error('Nova chat error:', error);

        const errorMessage: NovaMessage = {
          id: `msg_${Date.now() + 1}`,
          type: 'assistant',
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [conversationId, isLoading]
  );

  const clearMessages = React.useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  const loadConversation = React.useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const loadHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        loadHeaders['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/v1/ai/nova/conversations/${id}`, {
        headers: loadHeaders,
      });
      if (!response.ok) throw new Error('Error al cargar conversación');
      const data = await response.json();
      const loaded: NovaMessage[] = (data.messages || []).map((m: any) => ({
        id: m.id,
        type: m.type,
        content: m.content,
        toolCalls: m.toolCalls,
        metadata: m.metadata,
        createdAt: new Date(m.createdAt),
      }));
      setMessages(loaded);
      setConversationId(id);
    } catch (error) {
      console.error('Nova load conversation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      messages,
      isLoading,
      isStreaming,
      sendMessage,
      clearMessages,
      conversationId,
      loadConversation,
    }),
    [messages, isLoading, isStreaming, sendMessage, clearMessages, conversationId, loadConversation]
  );

  return <NovaContext.Provider value={value}>{children}</NovaContext.Provider>;
}

export function useNova() {
  const context = React.useContext(NovaContext);

  if (context === undefined) {
    throw new Error('useNova must be used within a NovaProvider');
  }

  return context;
}