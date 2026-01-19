import { useCallback, useMemo, useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChatStore } from '../store/useChatStore';
import { MessageItem } from './MessageItem';
import { Button } from './ui/button';
import { ArrowDown } from 'lucide-react';
import { LiveMessage } from './LiveMessage';

export const ChatList = () => {
  const { messages, streamingState } = useChatStore();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);

  const displayMessages = useMemo(() => {
    if (!streamingState.isStreaming) return messages;
    
    return [
      ...messages, 
      {
        id: 'streaming-message',
        role: 'assistant',
        content: '', 
        htmlContent: '', 
        timestamp: 0 
      } as const
    ];
  }, [messages, streamingState.isStreaming]);

  const scrollToBottom = () => {
    virtuosoRef.current?.scrollToIndex({
      index: displayMessages.length - 1,
      align: 'end',
      behavior: 'smooth'
    });
  };

  const handleScroll = useCallback((isAtBottom: boolean) => {
    setAtBottom(isAtBottom);
  }, []);

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-black/50 relative">
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%', willChange: 'transform' }}
        data={displayMessages}
        initialTopMostItemIndex={displayMessages.length - 1}
        alignToBottom
        followOutput="auto"
        atBottomStateChange={handleScroll}
        overscan={{ main: 2000, reverse: 2000 }}
        defaultItemHeight={150}
        computeItemKey={(_, item) => item.id}
        itemContent={(_, message) => (
          <div className="px-4 py-2" style={{ transform: 'translateZ(0)' }}>
            {message.id === 'streaming-message' ? (
                <LiveMessage />
            ) : (
                <MessageItem 
                  role={message.role} 
                  content={message.content}
                  htmlContent={message.htmlContent}
                />
            )}
          </div>
        )}
        components={{
           Footer: () => <div className="h-8" />
        }}
      />
      
      {!atBottom && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full shadow-lg z-10 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-900 dark:text-slate-100"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-5 w-5 min-w-5" />
          <span className="sr-only">Scroll to bottom</span>
        </Button>
      )}
    </div>
  );
};
