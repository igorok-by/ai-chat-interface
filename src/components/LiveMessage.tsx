import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { streamEvents } from '../lib/streamEvents';
import DOMPurify from 'dompurify';

export const LiveMessage = React.memo(() => {
  const contentRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef({ html: '' });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = streamEvents.subscribe((payload) => {
      bufferRef.current.html = payload.html;

      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        if (contentRef.current) {
          // Direct DOM patch - Bypassing React
          contentRef.current.innerHTML = DOMPurify.sanitize(bufferRef.current.html);
        }
        rafRef.current = null;
      });
    });

    return () => {
        unsubscribe();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="flex max-w-[85%] md:max-w-[75%] gap-4 flex-row">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
          <Bot size={16} />
        </div>

        <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden shadow-sm bg-white dark:bg-zinc-900 border border-border rounded-tl-none">
           <div 
              ref={contentRef}
              className="markdown-body"
           />
           {/* Visual indicator that this is live */}
           <div className="mt-2 text-[10px] opacity-70 flex justify-end gap-2 border-t pt-1 border-black/5 dark:border-white/10">
             <span className="animate-pulse">● Generating...</span>
           </div>
        </div>
      </div>
    </div>
  );
});

LiveMessage.displayName = 'LiveMessage';
