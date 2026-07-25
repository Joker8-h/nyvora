'use client';

import * as React from 'react';
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface NovaInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoSpeak?: boolean;
  onToggleAutoSpeak?: (enabled: boolean) => void;
}

export function NovaInput({
  onSend,
  disabled = false,
  placeholder = 'Escribe o habla con Nova...',
  autoSpeak = false,
  onToggleAutoSpeak,
}: NovaInputProps) {
  const [value, setValue] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Voice Recognition Setup (Web Speech API)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'es-ES';

        rec.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setValue(transcript);
        };

        rec.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('La entrada por voz no está soportada por tu navegador. Te recomendamos usar Google Chrome o Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {onToggleAutoSpeak && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title={autoSpeak ? 'Voz activada (Nova leerá las respuestas)' : 'Activar voz alta para escuchar a Nova'}
          onClick={() => onToggleAutoSpeak(!autoSpeak)}
          className={cn('h-10 w-10 shrink-0', autoSpeak ? 'text-primary bg-primary/10' : 'text-muted-foreground')}
        >
          {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        title={isListening ? 'Detener micrófono' : 'Hablar con Nova por voz'}
        className={cn(
          'h-10 w-10 shrink-0 transition-all',
          isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>

      <Input
        ref={inputRef}
        type="text"
        placeholder={isListening ? 'Escuchando tu voz...' : placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn('flex-1 h-10', isListening && 'border-red-500/50 bg-red-500/5')}
      />

      <Button
        type="submit"
        size="icon"
        disabled={!value.trim() || disabled}
        className="h-10 w-10 shrink-0"
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}