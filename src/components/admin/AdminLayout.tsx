import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { LayoutDashboard, BookOpen, Users, Settings, ArrowLeft, LogOut, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminAIChat } from './AdminAIChat';

export const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" />;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Government', path: '/admin/government', icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="p-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-display text-sm font-bold uppercase tracking-tighter">
                DE
              </div>
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-white" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
             <button 
               onClick={() => setIsAssistantOpen(true)}
               className="mb-4 flex w-full items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/20 group"
             >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Terminal className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest">AI Assistant</p>
                  <p className="text-[8px] font-medium uppercase opacity-60">Query Data</p>
                </div>
             </button>

             <div className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3 mb-3">
                   <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Settings className="h-4 w-4" />
                   </div>
                   <div className="overflow-hidden">
                      <p className="truncate text-[10px] font-bold text-white uppercase tracking-tighter">{user.email}</p>
                      <p className="text-[8px] text-slate-500 uppercase font-black uppercase tracking-widest">System Admin</p>
                   </div>
                </div>
                <Link 
                  to="/" 
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Exit Admin
                </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            {navItems.find(i => i.path === location.pathname)?.label || 'Administration'}
          </h2>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsAssistantOpen(true)}
               className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition-all"
             >
                <Sparkles className="h-3 w-3" />
                Assistant
             </button>
             <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Live</span>
          </div>
        </header>

        <main className="p-8 pb-20">
           <Outlet />
        </main>
      </div>

      {/* Slide-out AI Assistant */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/5 shadow-2xl"
            >
              <AdminAIChat onClose={() => setIsAssistantOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
