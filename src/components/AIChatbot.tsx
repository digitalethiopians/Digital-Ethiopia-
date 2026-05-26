import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare, Info } from 'lucide-react';
import { startAIChat, sendMessageToAI } from '../services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Digital Ethiopia AI Assistant. How can I help you today? You can ask me about our courses, history, culture, or any language help you need.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chat = startAIChat();
      setChatInstance(chat);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatInstance) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAI(chatInstance, input);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full max-w-6xl mx-auto flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Digital Ethiopia Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Online & Ready</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 transition-colors">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30 p-6">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm ${
                    msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-5 py-3 text-sm font-medium shadow-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-white px-5 py-3 text-sm shadow-sm border border-slate-100">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 delay-0" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 delay-150" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400 delay-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-100 bg-white p-6">
        <form onSubmit={handleSend} className="relative flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Digital Ethiopia..."
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-6 py-4 pr-16 text-sm font-medium transition-all focus:border-emerald-500 focus:bg-white focus:ring-0"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <Sparkles className="h-5 w-5 text-emerald-400 opacity-50" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </button>
        </form>
        <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Powered by Gemini 3.1 • Professional Assistant
        </p>
      </div>
    </div>
  );
};
