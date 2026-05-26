import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { signInWithGoogle } from '../lib/firebase';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Rocket, ShieldCheck, Zap } from 'lucide-react';

export const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* Left Side: Visual/Branding */}
        <div className="relative hidden flex-col justify-between bg-emerald-950 p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 font-display text-lg font-bold uppercase tracking-tighter">
              DE
            </div>
            <h2 className="mt-8 font-display text-4xl font-bold leading-tight">
              Empowering the <span className="text-amber-400">Next Generation</span> of Digital Leaders.
            </h2>
            <p className="mt-6 text-emerald-100/60 leading-relaxed text-sm">
              Join thousands of students in Ethiopia gaining the skills needed for the future of tech and entrepreneurship.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                   <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white">Fast Learning</p>
                   <p className="text-[10px] text-emerald-100/40 uppercase">Optimized curriculum</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                   <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white">Verified Skills</p>
                   <p className="text-[10px] text-emerald-100/40 uppercase">Industry standards</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500 uppercase tracking-widest font-medium">Continue your journey with us.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 shadow-sm hover:shadow-md"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
              Sign in with Google
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity" 
              />
            </button>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-300">Enterprise Access Only</span>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
               <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                     <Rocket className="h-4 w-4" />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-emerald-900 leading-tight">Digital Ethiopia Single Sign-On</p>
                     <p className="mt-1 text-[10px] text-emerald-600 font-medium uppercase tracking-tight">Secure authentication for Ethiopian students & faculty</p>
                  </div>
               </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 leading-loose">
            By signing in, you agree to our <br className="sm:hidden" />
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors">Terms of Service</a> & <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
