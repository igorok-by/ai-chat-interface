import React from 'react';
import { useChatWorker } from './hooks/useChatWorker';
import { ChatList } from './components/ChatList';
import { Button } from './components/ui/button';
import { ChatInput } from './components/ChatInput';
import { Play, Square, Trash2 } from 'lucide-react';
import { useChatStore } from './store/useChatStore';

function App() {
  const { generateResponse, stopGeneration, isStreaming } = useChatWorker();
  const clearHistory = useChatStore(state => state.clearHistory);
  const addMessages = useChatStore(state => state.addMessages);
  const messages = useChatStore(state => state.messages);
  
  const workerRef = React.useRef<Worker | null>(null);
  
  React.useEffect(() => {
    if (messages.length === 0) {
       const worker = new Worker(new URL('./workers/mockData.worker.ts', import.meta.url), {
         type: 'module'
       });
       workerRef.current = worker;
       
       worker.onmessage = (e) => {
         if (e.data.type === 'MOCK_CHUNK') {
           addMessages(e.data.payload);
         } else if (e.data.type === 'MOCK_COMPLETE') {
           worker.terminate();
           workerRef.current = null;
         }
       };
       
       worker.postMessage('START_MOCK_GENERATION');
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground font-sans">
      <header className="h-14 border-b flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
             AI
           </div>
           <h1 className="font-semibold text-lg tracking-tight">High-Performance Chat</h1>
           <div className="ml-4 px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-muted-foreground border">
             {messages.length} messages
           </div>
        </div>
        
        <div className="flex gap-2">
            {!isStreaming ? (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={generateResponse}
                  className="hidden md:flex bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                >
                  <Play size={16} className="mr-2" />
                  Generate Response
                </Button>
              ) : (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={stopGeneration}
                >
                  <Square size={16} className="mr-2" />
                  Stop
                </Button>
            )}

           <Button variant="ghost" size="sm" onClick={clearHistory} disabled={isStreaming} title="Clear history">
             <Trash2 size={18} className="text-muted-foreground hover:text-red-500 transition-colors" />
           </Button>
           <a 
             href="https://github.com/vitejs/vite" 
             target="_blank" 
             className="text-xs text-muted-foreground hover:text-foreground transition-colors"
           >
             Powered by Vite & WebWorkers
           </a>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
         <div className="flex-1 min-h-0">
            <ChatList />
         </div>
         <ChatInput />
      </main>
    </div>
  )
}

export default App
