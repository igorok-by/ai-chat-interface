# AI Chat Interface

A high-performance AI chat interface built with React, TypeScript, and Vite, optimized for handling large message volumes and real-time streaming.

## 🚀 Live Demo

**[View Live Application](https://igorok-by.github.io/ai-chat-interface/)**

The application is automatically deployed to GitHub Pages on every push to the main branch.

## ✨ Features

- **High Performance**: Direct DOM patching for streaming messages bypasses React re-renders
- **Virtual Scrolling**: Efficient rendering of 100+ messages using `react-virtuoso`
- **Real-time Streaming**: Web Worker-based text generation with smooth updates
- **Dark Mode Support**: Fully responsive UI with Tailwind CSS
- **Smart Auto-scroll**: Automatically follows new messages, pauses when scrolling up
- **Optimized Rendering**: GPU-accelerated scrolling and aggressive pre-rendering

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** for blazing-fast development
- **Zustand** for state management
- **react-virtuoso** for virtual scrolling
- **Web Workers** for background processing
- **Tailwind CSS** for styling
- **Marked** + **DOMPurify** for safe Markdown rendering

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🏗️ Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

## 🚀 Deployment

The app automatically deploys to GitHub Pages via GitHub Actions when you push to `main`.

To deploy manually:
```bash
npm run deploy
```

## 📝 Architecture Highlights

### Direct DOM Patching
The streaming message component uses direct `innerHTML` updates via refs, completely bypassing React's reconciliation for zero-cost real-time updates.

### Event-Driven Updates
Streaming chunks are routed through a custom event emitter, avoiding expensive state updates during high-frequency token arrivals.

### Aggressive Pre-rendering
Virtual list configured with 2000px overscan in both directions to eliminate white flashes during rapid scrolling.

## 📄 License

MIT
