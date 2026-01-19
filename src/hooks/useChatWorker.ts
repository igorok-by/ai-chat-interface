import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { streamEvents } from '../lib/streamEvents';
import type { WorkerMessage, Message } from '../types/chat';

export function useChatWorker() {
  const workerRef = useRef<Worker | null>(null);
  const { 
    addMessage, 
    setStreamingState, 
    streamingState 
  } = useChatStore();

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/stream.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, payload } = event.data;

      if (type === 'CHUNK' && payload) {
        // High perf: Emit event, don't update React state
        streamEvents.emit(payload);
        
        // Ensure streaming state is true (idempotent, won't cause render if already true)
        setStreamingState({ isStreaming: true });
        
      } else if (type === 'COMPLETE' || type === 'STOPPED') {
        const finalContent = payload?.content || '';
        const finalHtml = payload?.html || '';

        const newMessage: Message = {
           id: crypto.randomUUID(),
           role: 'assistant',
           content: finalContent,
           htmlContent: finalHtml,
           timestamp: Date.now()
        };
         
        if (newMessage.content) {
          addMessage(newMessage);
        }
        
        setStreamingState({ isStreaming: false });
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [addMessage, setStreamingState]);

  const generateResponse = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ action: 'START_GENERATION', targetCount: 10000 });
  }, []);

  const stopGeneration = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ action: 'STOP_GENERATION' });
  }, []);

  return {
    generateResponse,
    stopGeneration,
    isStreaming: streamingState.isStreaming
  };
}
