import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { useChatStore } from '../store/useChatStore';

export const ChatInput = () => {
  const [content, setContent] = useState('');
  const addMessage = useChatStore(state => state.addMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      htmlContent: content.trim(),
      timestamp: Date.now()
    });

    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       handleSubmit(e as unknown as React.FormEvent);
     }
  };

  return (
    <div className="border-t bg-white dark:bg-zinc-950 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 min-h-[44px] max-h-32 p-3 rounded-xl border border-input bg-transparent text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          rows={1}
        />
        <Button 
            type="submit" 
            size="icon"
            disabled={!content.trim()}
            className="h-11 w-11 shrink-0 rounded-xl"
        >
          <Send size={18} />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};
