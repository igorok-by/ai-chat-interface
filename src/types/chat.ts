export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  htmlContent: string;
  timestamp: number;
}

export interface StreamingState {
  isStreaming: boolean;
}

export type WorkerAction = 'START_GENERATION' | 'STOP_GENERATION';

export interface WorkerMessage {
  type: 'CHUNK' | 'COMPLETE' | 'STOPPED';
  payload?: {
    content: string;
    html: string;
  }
}

export interface WorkerCommand {
  action: WorkerAction;
  targetCount?: number;
}
