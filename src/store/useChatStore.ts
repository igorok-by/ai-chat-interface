import { create } from 'zustand';
import type { Message, StreamingState } from '../types/chat';

interface ChatStore {
  messages: Message[];
  streamingState: StreamingState;
  
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  setStreamingState: (state: Partial<StreamingState>) => void;
  clearHistory: () => void;
}

const INITIAL_STREAMING_STATE: StreamingState = {
  isStreaming: false
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  streamingState: INITIAL_STREAMING_STATE,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  addMessages: (newMessages) => set((state) => ({
    messages: [...state.messages, ...newMessages]
  })),

  setStreamingState: (updates) => set((state) => ({
    streamingState: { ...state.streamingState, ...updates }
  })),

  clearHistory: () => set({ messages: [] })
}));
