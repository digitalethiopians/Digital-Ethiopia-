import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyCertificate } from '../lib/firestoreService';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  BookOpen, 
  Award,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get('id') || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleVerify(id);
    }
  }, [searchParams]);

  const handleVerify = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    
    setStatus('loading');
    try {
      const data = await verifyCertificate(idToVerify);
      if (data.valid) {
        setResult(data.data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-6">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Certificate Verification
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Verify the authenticity of academic and TVET credentials issued by Digital Ethiopia.
        </p>
      </div>

      <div className="mt-12">
        <div className="relative mx-auto max-w-lg">
          <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100 transition-all focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-700/10">
            <div className="flex flex-1 items-center px-4">
              <Search className="h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. cert_...)"
                className="w-full border-none bg-transparent px-4 py-4 text-sm font-medium focus:outline-none focus:ring-0"
              />
            </div>
            <button 
              onClick={() => handleVerify(certId)}
              disabled={status === 'loading'}
              className="bg-emerald-800 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-900 disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AnimatePresence mode="wait">
          {status === 'success' && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-emerald-50/50 p-8 text-slate-900"
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-emerald-100 text-emerald-600">
                  <Award className="h-12 w-12" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Verified Authentic</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
                    {result.courseTitle}
                  </h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Issued To</p>
                          <p className="font-bold text-slate-800">{result.userName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Issue Date</p>
                          <p className="font-bold text-slate-800">
                            {result.issuedAt?.toDate ? result.issuedAt.toDate().toLocaleDateString() : 'Originality Verified'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Credential ID</p>
                          <p className="font-mono text-sm font-bold text-emerald-600">{result.certificateId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Platform</p>
                          <p className="font-bold text-slate-800">Digital Ethiopia Platform</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-hidden rounded-[2.5rem] border border-red-100 bg-red-50/50 p-8 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
                <XCircle className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Certificate Not Found</h3>
              <p className="mt-2 text-slate-600">The certificate ID provided could not be verified in our records.</p>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm mx-auto uppercase font-bold tracking-widest">
                Please double-check the ID or contact the issuing institution.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-24 rounded-[3rem] bg-slate-900 p-8 sm:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h4 className="font-display text-3xl font-bold tracking-tight mb-4 text-amber-400">Secure Originality</h4>
            <p className="text-slate-400 leading-relaxed font-medium">
               Digital Ethiopia uses cryptographic verification to ensure that every certificate is tamper-proof. 
               This portal provides a universal way for employers and universities to confirm the validity of 
               training and academic achievements across Ethiopia and beyond.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">Tamper-Proof Design</p>
                <p className="text-xs text-slate-500">Secure immutable verification.</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
             <div className="mb-6 h-1 w-24 bg-amber-400" />
             <blockquote className="text-xl font-medium leading-relaxed italic text-slate-300">
               "Ensuring academic integrity is the cornerstone of our digital transformation. 
               We bridge the trust gap between education and the global workforce."
             </blockquote>
             <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20" />
                <div>
                   <p className="text-sm font-bold">Academic Board</p>
                   <p className="text-xs text-slate-500">Digital Ethiopia Initiative</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
