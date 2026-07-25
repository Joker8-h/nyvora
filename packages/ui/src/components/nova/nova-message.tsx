'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { NovaToolCall } from './nova-tool-call';
import type { NovaMessage as NovaMessageType } from '@nyvora/types';
import { formatRelativeTime } from '@nyvora/shared';
import { Bot, User, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

interface NovaMessageProps {
  message: NovaMessageType;
}

export function NovaMessage({ message }: NovaMessageProps) {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';
  const isTool = message.type === 'tool';
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (isTool) {
    return null; // Tool messages are rendered within assistant messages
  }

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4 relative group',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Tool Calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-4 space-y-2">
            {message.toolCalls.map((toolCall) => (
              <NovaToolCall key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2">
          <div
            className={cn(
              'text-xs',
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {formatRelativeTime(message.createdAt)}
          </div>

          {isAssistant && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSpeak}
              title={isSpeaking ? 'Detener lectura' : 'Escuchar respuesta en voz alta'}
              className={cn(
                'h-6 w-6 rounded-full text-muted-foreground hover:text-foreground transition-all',
                isSpeaking && 'text-primary animate-pulse bg-primary/10'
              )}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}