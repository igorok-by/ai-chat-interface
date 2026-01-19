import { marked } from 'marked';
import type { WorkerCommand, WorkerMessage } from '../types/chat';

let isGenerating = false;
let intervalId: number | null = null;
let currentContent = '';

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "**this is bold**", "`const code = true`", 
  "# Header 1", "## Header 2", 
  "```javascript\nconsole.log('High perf');\n```"
];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

self.onmessage = (e: MessageEvent<WorkerCommand>) => {
  const { action, targetCount = 10000 } = e.data;

  if (action === 'START_GENERATION') {
    if (isGenerating) return;
    isGenerating = true;
    currentContent = '';
    
    let wordCount = 0;

    intervalId = self.setInterval(() => {
        if (!isGenerating) {
            if (intervalId) clearInterval(intervalId);
            return;
        }

        const chunkParams = Math.floor(Math.random() * 5) + 1;
        let newChunk = '';
        
        for (let i = 0; i < chunkParams; i++) {
           newChunk += (wordCount > 0 ? ' ' : '') + getRandomWord();
           wordCount++;
        }
        
        currentContent += newChunk;

        const html = marked.parse(currentContent) as string;

        const message: WorkerMessage = {
            type: 'CHUNK',
            payload: {
                content: currentContent,
                html: html
            }
        };

        self.postMessage(message);

        if (wordCount >= targetCount) {
            isGenerating = false;
            clearInterval(intervalId!);
            self.postMessage({ type: 'COMPLETE' } as WorkerMessage);
        }

    }, 15);
  }

  if (action === 'STOP_GENERATION') {
    isGenerating = false;
    if (intervalId) clearInterval(intervalId);
    
    // Send the partial content so the UI can save it
    self.postMessage({ 
        type: 'STOPPED',
        payload: {
            content: currentContent,
            html: marked.parse(currentContent) as string
        }
    } as WorkerMessage);
  }
};
