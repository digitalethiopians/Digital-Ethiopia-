import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, X, Terminal, Database } from 'lucide-react';
import { startAdminAIChat, sendMessageToAI } from '../../services/aiService';
import { getAllUsers, getAllEnrollments, getCourses } from '../../lib/firestoreService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AdminAIChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Admin System Online. I can help you analyze platform metrics, course status, or student progress. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const chat = startAdminAIChat();
        setChatInstance(chat);
        
        // Provide initial context to the AI about the counts (silently)
        const [users, enrollments, courses] = await Promise.all([
          getAllUsers(),
          getAllEnrollments(),
          getCourses()
        ]);
        
        const contextMsg = `[SYSTEM CONTEXT]: Current platform stats: Total Users: ${users?.length || 0}, Total Enrollments: ${enrollments?.length || 0}, Total Courses: ${courses?.length || 0}. Completed Enrollments: ${enrollments?.filter((e: any) => e.progress === 100).length || 0}.`;
        
        // We don't need to await this or show it to the user
        await chat.sendMessage({ message: contextMsg });
      } catch (err) {
        console.error(err);
      }
    };
    initChat();
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
    <div className="flex h-full flex-col bg-slate-900 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 bg-slate-950 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">System Assistant</h3>
            <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-tighter">Admin Logic Enabled</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-3 text-xs font-medium leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-[10px] font-bold text-emerald-400 border border-white/5">
                <Database className="h-3 w-3 animate-pulse" />
                Querying Data...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 bg-slate-950 p-6">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query platform metrics..."
            className="flex-1 rounded-xl border-none bg-white/5 px-5 py-3 text-xs font-medium text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
