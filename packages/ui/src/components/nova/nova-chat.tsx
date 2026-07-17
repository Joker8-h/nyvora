'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { NovaMessage } from './nova-message';
import { NovaInput } from './nova-input';
import { NovaSuggestions } from './nova-suggestions';
import { NovaThinking } from './nova-thinking';
import { useNova } from '../../hooks/use-nova';
import { useNovaConversations, useDeleteNovaConversation, type NovaConversationSummary } from '@/lib/hooks';
import { Plus, Trash2, MessageSquare } from 'lucide-react';

interface NovaChatProps {
  className?: string;
}

const defaultSuggestions = [
  'Crear un cliente nuevo',
  'Ver facturas pendientes',
  'Reporte de ventas del mes',
  'Crear una campaña de marketing',
];

export function NovaChat({ className }: NovaChatProps) {
  const { messages, isLoading, isStreaming, sendMessage, conversationId, loadConversation, clearMessages } = useNova();
  const conversationsQuery = useNovaConversations();
  const deleteConversation = useDeleteNovaConversation();
  const [showSidebar, setShowSidebar] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  const handleSelect = async (id: string) => {
    await loadConversation(id);
  };

  const handleNew = () => {
    clearMessages();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteConversation.mutateAsync(id);
    if (conversationId === id) clearMessages();
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Conversations sidebar */}
      {showSidebar && (
        <div className="w-64 shrink-0 border-r flex flex-col">
          <div className="p-3 border-b">
            <Button size="sm" className="w-full" onClick={handleNew}>
              <Plus className="mr-1 h-4 w-4" />
              Nueva conversación
            </Button>
          </div>
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {conversationsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground p-2">Cargando...</p>
              ) : (conversationsQuery.data as NovaConversationSummary[] | undefined)?.length ? (
                (conversationsQuery.data as NovaConversationSummary[]).map((c) => (
                  <button
                    key={c.conversationId}
                    onClick={() => handleSelect(c.conversationId)}
                    className={cn(
                      'w-full text-left rounded-md px-3 py-2 text-sm transition-colors group relative',
                      conversationId === c.conversationId
                        ? 'bg-primary/10 text-foreground'
                        : 'hover:bg-muted text-muted-foreground',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{c.lastMessage || 'Conversación'}</p>
                        <p className="text-xs opacity-60">
                          {new Date(c.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDelete(e, c.conversationId)}
                      className="absolute right-1 top-1 hidden rounded p-1 text-muted-foreground hover:text-destructive group-hover:block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-2">Sin conversaciones previas</p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat */}
      <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSidebar((s) => !s)}
          className="md:hidden"
        >
          Historial
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <svg
            className="h-6 w-6 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Nova</h2>
          <p className="text-sm text-muted-foreground">Tu asistente de IA</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hola, soy Nova</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Tu asistente inteligente. Puedo ayudarte a gestionar clientes, crear facturas,
              generar reportes y mucho más.
            </p>
            <NovaSuggestions
              suggestions={defaultSuggestions}
              onSelect={handleSend}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <NovaMessage key={message.id} message={message} />
            ))}
            {isLoading && <NovaThinking />}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <NovaInput onSend={handleSend} disabled={isLoading} />
      </div>
      </div>
    </div>
  );
}