import React from 'react';
import { LogOut, Sparkles, ShieldCheck, Languages } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { translations } from '../lib/translations';

export const Navbar = () => {
  const { user, isAdmin, language, setLanguage } = useAuth();
  const t = translations[language];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 font-display text-xs font-bold text-white uppercase">
              DE
            </div>
            <span className="hidden font-display text-base font-bold tracking-tight text-slate-800 md:block">
              {t.heroTitle}
            </span>
          </Link>
          
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/courses" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
              {t.navCourses}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
                {t.navDashboard}
              </Link>
            )}
            <Link to="/services" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
              {t.navServices}
            </Link>
            <Link to="/verify" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
              <ShieldCheck className="h-4 w-4" />
              Verify
            </Link>
            <Link to="/government" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
              Government
            </Link>
            <Link to="/assistant" className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'om' : 'en')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Languages size={14} />
            {language === 'en' ? 'EN' : 'OM'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 transition-all hover:bg-emerald-100 sm:block"
                >
                  {t.navAdmin}
                </Link>
              )}
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-xs font-bold text-slate-900 leading-tight">{user.displayName}</span>
                <span className="text-[10px] text-slate-400">{user.email}</span>
              </div>
              <button
               onClick={() => logout()}
               className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-emerald-700 transition-all"
               title="Logout"
             >
               <LogOut className="h-4 w-4" />
             </button>
           </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-emerald-800 px-5 py-2 text-xs font-bold text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Access Portal
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
