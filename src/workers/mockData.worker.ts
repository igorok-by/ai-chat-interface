import { marked } from 'marked';
import type { Message } from '../types/chat';

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "**bold**", "`code`", "## Subheader"
];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateRandomText(minWords: number, maxWords: number): string {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  return words.join(' ');
}

self.onmessage = (e: MessageEvent) => {
  if (e.data === 'START_MOCK_GENERATION') {
    const messages: Message[] = [];
    const TOTAL_MESSAGES = 100;
    
    for (let i = 0; i < TOTAL_MESSAGES; i++) {
        const isLongMessage = i % 20 === 0;
        const wordCount = isLongMessage ? 4000 : Math.floor(Math.random() * 50) + 10;
        
        const content = generateRandomText(wordCount, isLongMessage ? 5000 : 100);
        const html = marked.parse(content) as string;
        
        messages.push({
            id: crypto.randomUUID(),
            role: i % 2 === 0 ? 'user' : 'assistant',
            content,
            htmlContent: html,
            timestamp: Date.now() - (TOTAL_MESSAGES - i) * 60000
        });
        
        if (messages.length >= 20) {
             self.postMessage({ type: 'MOCK_CHUNK', payload: [...messages] });
             messages.length = 0;
        }
    }
    
    if (messages.length > 0) {
        self.postMessage({ type: 'MOCK_CHUNK', payload: [...messages] });
    }
    
    self.postMessage({ type: 'MOCK_COMPLETE' });
  }
};
