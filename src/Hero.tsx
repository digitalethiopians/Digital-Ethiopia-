import React from 'react';
import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { Link } from 'react-router-dom';
import { translations } from './lib/translations';

export const Hero = () => {
  const { user, language } = useAuth();
  const t = translations[language];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 px-8 py-20 text-white shadow-2xl lg:px-16"
      >
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-800/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-800/50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300"
          >
            <Rocket className="h-4 w-4 text-emerald-400" />
            <span>Featured Learning Path</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          >
            {t.heroTitle.split(' ').slice(0, 2).join(' ')} <br className="hidden lg:block" />
            <span className="text-amber-400">{t.heroTitle.split(' ').slice(2).join(' ')}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-emerald-100/70 sm:text-xl"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start"
          >
            {!user ? (
              <Link
                to="/login"
                className="rounded-xl bg-amber-500 px-8 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95"
              >
                {t.startLearning}
              </Link>
            ) : (
              <Link
                to="/courses"
                className="rounded-xl bg-amber-500 px-8 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95 text-center"
              >
                {t.accessCourses}
              </Link>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-emerald-900 bg-slate-400" />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-emerald-300">{t.studentsCount}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60">{t.coursesCount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
