'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { NovaToolCall } from './nova-tool-call';
import type { NovaMessage as NovaMessageType } from '@nyvora/types';
import { formatRelativeTime } from '@nyvora/shared';
import { Bot, User } from 'lucide-react';

interface NovaMessageProps {
  message: NovaMessageType;
}

export function NovaMessage({ message }: NovaMessageProps) {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';
  const isTool = message.type === 'tool';

  if (isTool) {
    return null; // Tool messages are rendered within assistant messages
  }

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
          'max-w-[80%] rounded-lg p-4',
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

        <div
          className={cn(
            'mt-2 text-xs',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {formatRelativeTime(message.createdAt)}
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