import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { translations } from '../lib/translations';
import { 
  Cpu, 
  Target, 
  BarChart3, 
  Globe2, 
  Zap, 
  Users2, 
  ShieldAlert, 
  BookMarked,
  Microscope,
  HardHat
} from 'lucide-react';

const VisionCard = ({ icon: Icon, title, items, color }: { icon: any, title: string, items: string[], color: string, key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
  >
    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${color} opacity-0 blur-2xl transition-opacity group-hover:opacity-20`} />
    
    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')} `}>
      <Icon className="h-6 w-6" />
    </div>
    
    <h3 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
          <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

export const VisionSection = () => {
  const { language } = useAuth();
  const t = translations[language];

  const categories = [
    {
      icon: Target,
      title: language === 'en' ? "University Digital Hubs" : "Giddu-galeesssa Diijitaalaa Yuunivarsiitii",
      color: "bg-blue-600",
      items: language === 'en' ? [
        "Infrastructure: Implementing campus-wide high-speed connectivity and secure cloud data centers.",
        "Research Digitization: Digital libraries, open-access journals, and collaborative AI research tools.",
        "E-Administration: Automated student information systems and secure blockchain-based degree verification.",
        "Virtual Campuses: Hybrid learning models integrating MOOCs and interactive remote lectures."
      ] : [
        "Sifaa: Konektiivitii ariitii qabu fi giddu-galeessawwan daataa duumessaa.",
        "Qunnamtii Qorannoo: Kitaabota diijitalla, joornaalota fi meeshaalee AI.",
        "E-Administration: Sirna odeeffannoo barattootaa fi mirkaneessa digrii.",
        "Campuses Virtual: Moodela barachuu haayibriidii."
      ]
    },
    {
      icon: Zap,
      title: language === 'en' ? "TVET Modernization" : "Ammayyeessuu TVET",
      color: "bg-emerald-600",
      items: language === 'en' ? [
        "Immersive Learning: VR/AR for high-risk practical training (welding, machining, medical).",
        "Market Alignment: AI analytics to synchronize curricula with evolving industrial labor needs.",
        "Digital Portfolios: Showcasing practical skills to global employers via verifiable digital badges."
      ] : [
        "Barachuu Imarsiivii: VR/AR leenjii hojii qabatamaaf.",
        "Walsimsiisuu Gabaa: AI fayyadamuun dandeettii hojii waliin walsimsiisuu.",
        "Portofooliyoo Diijitaalaa: Dandeettii hojii addunyaatti agarsiisuu."
      ]
    },
    {
      icon: Globe2,
      title: language === 'en' ? "Public Sector Modernization" : "Ammayyeessuu Damee Ummataa",
      color: "bg-indigo-600",
      items: language === 'en' ? [
        "Gov Digitalization: Converting legacy employee records into secure, high-integrity digital databases.",
        "Accessibility: Reaching remote and underserved populations through mobile-first digital learning.",
        "Economic Growth: Drive Ethiopia's digital economy transformation through workforce upskilling.",
        "Resource Optimization: Shared digital infrastructure reducing overhead for public institutions."
      ] : [
        "Mootummaa Diijitalla: Galmeewwan hojjettootaa diijitalla gochuu.",
        "Dhaqqabamummaa: Namoota fagoo jiran hunda bira gahuu.",
        "Guddina Diinaagdee: Diinaagdee diijitalla guddisuu.",
        "Fayyadamummaa Qabeenyaa: Sirna diijitalla waloo uumuu."
      ]
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-4">{t.visionTitle}</h2>
            <h3 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Modernizing Ethiopia <br className="hidden sm:block" /> Through Digital Excellence.
            </h3>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed font-medium">
              {t.footerDescription}
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="h-16 w-px bg-slate-200 hidden lg:block" />
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600">
                   <HardHat className="h-5 w-5" />
                   <span className="text-sm font-bold uppercase tracking-widest">Industry 4.0</span>
                </div>
                <p className="text-xs text-slate-400 font-medium max-w-[200px]">Aligning skills with the rapid advancement of modern automation.</p>
             </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <VisionCard key={i} {...cat} />
          ))}
        </div>

        <div className="mt-16 rounded-[2.5rem] bg-slate-900 p-8 sm:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
             <div>
                <h4 className="font-display text-3xl font-bold tracking-tight mb-4">System-Wide Transformation</h4>
                <p className="text-slate-400 leading-relaxed font-medium">
                   Beyond just digitizing content, we are moving towards full integration through automation, AI, and big data analytics—redefining how skills are acquired and certified globally.
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Safe Practice", value: "VR/AR" },
                  { label: "Global Reach", value: "Digital ID" },
                  { label: "Market Data", value: "AI Big Data" },
                  { label: "Self-Paced", value: "MOOCs" }
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
