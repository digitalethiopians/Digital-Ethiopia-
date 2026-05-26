import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Book, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Cpu, 
  Code 
} from 'lucide-react';

const ResourceCategory = ({ title, icon: Icon, links }: { title: string, icon: any, links: any[] }) => (
  <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 h-full">
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
      <Icon size={28} />
    </div>
    <h3 className="mb-6 text-xl font-bold text-slate-900">{title}</h3>
    <ul className="space-y-4">
      {links.map((link, idx) => (
        <li key={idx}>
          <a 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-slate-50 hover:border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-emerald-700">{link.label}</span>
            </div>
            <ExternalLink size={14} className="text-slate-300 transition-colors group-hover:text-emerald-400" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const Resources = () => {
  const categories = [
    {
      title: "Government Portals",
      icon: Building2,
      links: [
        { label: "Ethiopian Federal Government", href: "https://www.ethiopia.gov.et" },
        { label: "FDRE Ministry of Education", href: "https://moe.gov.et" },
        { label: "Digital Ethiopia 2025 Strategy", href: "https://mint.gov.et" },
        { label: "Public Service Commission", href: "https://psc.gov.et" }
      ]
    },
    {
      title: "Academic Institutions",
      icon: GraduationCap,
      links: [
        { label: "Jimma University", href: "https://www.ju.edu.et" },
        { label: "Adama Science & Technology", href: "https://www.astu.edu.et" },
        { label: "Haramaya University", href: "https://www.haramaya.edu.et" },
        { label: "Addis Ababa University", href: "http://www.aau.edu.et" }
      ]
    },
    {
      title: "Learning Platforms",
      icon: Book,
      links: [
        { label: "Coursera Online Courses", href: "https://www.coursera.org" },
        { label: "UNESCO Education Resources", href: "https://en.unesco.org/themes/education-21st-century" },
        { label: "Khan Academy", href: "https://www.khanacademy.org" },
        { label: "O'Reilly Media", href: "https://www.oreilly.com" }
      ]
    },
    {
      title: "Tech & Innovation",
      icon: Cpu,
      links: [
        { label: "GitHub - Build Software", href: "https://github.com" },
        { label: "Stack Overflow", href: "https://stackoverflow.com" },
        { label: "W3Schools Tutorial", href: "https://www.w3schools.com" },
        { label: "MDN Web Docs", href: "https://developer.mozilla.org" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20"
          >
            <Globe size={32} />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Useful <span className="text-emerald-600">Links</span> & Resources</h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed">
            A curated directory of essential digital portals and educational platforms 
            supporting the Digital Ethiopia Platform.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ResourceCategory {...cat} />
            </motion.div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -m-12 opacity-10">
            <ShieldCheck size={300} />
          </div>
          <h2 className="text-2xl font-bold mb-4 relative z-10">Verified Content</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            All external links provided here are vetted for academic and professional relevance. 
            Digital Ethiopia ensures that these resources meet international educational standards.
          </p>
          <div className="flex items-center justify-center gap-6 relative z-10 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
               <ShieldCheck size={16} /> Certified Quality
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
               <GraduationCap size={16} /> Academic Standards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
