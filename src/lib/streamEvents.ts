type StreamListener = (payload: { content: string; html: string }) => void;

class StreamEventEmitter {
  private listeners: Set<StreamListener> = new Set();

  subscribe(listener: StreamListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(payload: { content: string; html: string }) {
    this.listeners.forEach(listener => listener(payload));
  }
}

export const streamEvents = new StreamEventEmitter();
