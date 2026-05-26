import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Download, X, Printer, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Certificate {
  id: string;
  userName: string;
  courseTitle: string;
  issuedAt: any;
  certificateId: string;
}

export const CertificateModal = ({ cert, isOpen, onClose }: { cert: Certificate | null, isOpen: boolean, onClose: () => void }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!cert) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    
    setIsGenerating(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Certificate_${cert.userName}_${cert.courseTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedDate = cert.issuedAt?.toDate ? cert.issuedAt.toDate().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'Recently';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
          >
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 p-6 px-8">
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                     <Award className="h-6 w-6" />
                  </div>
                  <div>
                     <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Course Certificate</h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Official Verification</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    disabled={isGenerating}
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-200 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                    <X className="h-6 w-6 text-slate-400" />
                  </button>
               </div>
            </div>

            {/* Certificate Body (Printable) */}
            <div className="p-8 sm:p-12 print:p-0">
               <div 
                 ref={printRef}
                 className="relative min-h-[500px] overflow-hidden rounded-3xl border-[20px] border-emerald-900/5 bg-white p-12 text-center shadow-inner print:rounded-none print:border-none"
               >
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-emerald-50 opacity-20 blur-3xl" />
                  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-50 opacity-20 blur-3xl" />
                  
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                     <div className="font-display text-[20vw] font-black tracking-tighter">DO</div>
                  </div>

                  <div className="relative z-10 space-y-8">
                     <div className="flex justify-center">
                        <div className="relative">
                           <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-20" />
                           <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl">
                              <Award className="h-10 w-10" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-display text-lg font-bold uppercase tracking-[0.3em] text-emerald-800">Certificate of Completion</h4>
                        <p className="text-slate-500 font-medium">This is to certify that</p>
                        <h2 className="font-display text-5xl font-black text-slate-900 tracking-tight">{cert.userName}</h2>
                        <p className="max-w-md mx-auto text-slate-500 leading-relaxed">
                           has successfully completed all required modules and assessments for the professional course:
                        </p>
                        <h3 className="text-2xl font-bold text-emerald-600 tracking-tight">{cert.courseTitle}</h3>
                     </div>

                     <div className="pt-12 grid grid-cols-2 gap-12 border-t border-slate-100 max-w-2xl mx-auto">
                        <div className="text-left space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Issued</p>
                           <p className="text-sm font-bold text-slate-900">{formattedDate}</p>
                        </div>
                        <div className="text-right space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification ID</p>
                           <p className="text-sm font-mono font-bold text-slate-900">{cert.certificateId}</p>
                        </div>
                     </div>

                     <div className="pt-8 flex items-center justify-center gap-12">
                        <div className="text-center">
                           <div className="h-1 bg-slate-900 mb-2 w-32 mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Academic Director</p>
                        </div>
                        <div className="text-center">
                           <div className="h-1 bg-slate-900 mb-2 w-32 mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Platform Founder</p>
                        </div>
                     </div>

                     <div className="pt-8 flex items-center justify-center gap-2 text-emerald-600">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified by Digital Ethiopia</span>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-slate-50 px-8 py-6 text-center border-t border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Official Credentials Tracking
               </p>
               <a 
                 href={`/verify?id=${cert.certificateId}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm"
               >
                 <ShieldCheck className="h-3 w-3" />
                 View Public Verification Portal
               </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
