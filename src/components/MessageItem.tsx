import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageItemProps {
  role: 'user' | 'assistant';
  content?: string; // HTML content for assistant, or text for user?
                    // Actually our Message types have htmlContent.
  htmlContent?: string;
}

export const MessageItem = React.memo(({ role, content, htmlContent }: MessageItemProps) => {
  const sanitizedHtml = useMemo(() => {
    if (!htmlContent) return null;
    return DOMPurify.sanitize(htmlContent);
  }, [htmlContent]);

  return (
    <div className={cn(
      "flex w-full mb-6",
      role === 'user' ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] gap-4",
        role === 'user' ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {role === 'user' ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed overflow-hidden shadow-sm",
          role === 'user' 
            ? "bg-blue-600 text-white rounded-tr-none" 
            : "bg-white dark:bg-zinc-900 border border-border rounded-tl-none"
        )}>
           {role === 'assistant' && sanitizedHtml ? (
             <div 
                className="markdown-body" // specific class for global styling
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
             />
           ) : (
             <div className="whitespace-pre-wrap">{content}</div>
           )}
           
           <div className={cn(
             "mt-2 text-[10px] opacity-70 flex justify-end gap-2 border-t pt-1",
             role === 'user' ? "border-white/20" : "border-black/5 dark:border-white/10"
           )}>
             <span>{content?.length || 0} chars</span>
           </div>
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';
