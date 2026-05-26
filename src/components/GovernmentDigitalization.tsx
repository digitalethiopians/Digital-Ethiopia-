import React from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  ShieldCheck, 
  FileSearch, 
  HardDrive, 
  Users, 
  Scan, 
  Monitor, 
  Cloud, 
  Lock, 
  RefreshCw, 
  FileText,
  Search,
  Cpu,
  Layers,
  ArrowRight,
  ClipboardList,
  Zap
} from 'lucide-react';

const ProcessStep = ({ number, title, description, icon: Icon }: { number: string, title: string, description: string, icon: any }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex gap-6 items-start group"
  >
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-mono text-sm font-bold border-4 border-white shadow-xl shadow-slate-200">
        {number}
      </div>
      <div className="w-px h-full bg-slate-200 min-h-[40px] group-last:hidden" />
    </div>
    <div className="pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h4>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed max-w-md">
        {description}
      </p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, items }: { icon: any, title: string, items: string[], key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900">
      <Icon className="h-5 w-5" />
    </div>
    <h4 className="mb-3 text-sm font-black uppercase tracking-widest text-slate-900">{title}</h4>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <div className="h-1 w-1 rounded-full bg-emerald-500" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

export const GovernmentDigitalization = () => {
  const records = [
    "Employee Name", "ID Number", "Educational Background", 
    "Work Experience", "Salary & Position", "Employment History", 
    "Gov Service Records", "Benefits"
  ];

  const benefits = [
    { icon: Zap, title: "Faster Access", desc: "Instant retrieval of employee data from any location." },
    { icon: ShieldCheck, title: "Data Security", desc: "Encrypted storage with granular access controls." },
    { icon: FileText, title: "Reduced Paper", desc: "Going green by eliminating physical archives." },
    { icon: Monitor, title: "Modern Services", desc: "Citizen-centric government modernization." },
    { icon: RefreshCw, title: "Easy Recovery", desc: "Automated backups for disaster resilience." },
    { icon: Layers, title: "HR Integration", desc: "Seamless sync with payroll and HR systems." }
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-900 pt-24 pb-32 text-white">
        <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-500/10 blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl font-bold tracking-tight sm:text-6xl"
            >
              Digitization of <span className="text-emerald-400">Government</span> Employee Records
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-slate-400 leading-relaxed"
            >
              Transforming legacy paper-based archives into a robust, high-security digital ecosystem for a more efficient and transparent Ethiopian civil service.
            </motion.p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Scan, label: "Scanning", value: "High-Speed OCR" },
              { icon: Lock, label: "Security", value: "AES-256 Encryption" },
              { icon: Database, label: "Storage", value: "Centralized DB" },
              { icon: Cloud, label: "Platform", value: "Ethiopia Cloud" }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <stat.icon className="h-6 w-6 text-emerald-400 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            
            {/* Left: Process */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-4">The Implementation</h2>
              <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-12">
                Our Digitalization Process
              </h3>
              
              <div className="relative">
                <ProcessStep 
                  number="01"
                  icon={ClipboardList}
                  title="Collection"
                  description="Systematically gather all physical employee records from across government agencies."
                />
                <ProcessStep 
                  number="02"
                  icon={Scan}
                  title="Scanning"
                  description="Utilizing high-resolution industrial scanners to convert paper into high-fidelity digital images."
                />
                <ProcessStep 
                  number="03"
                  icon={FileSearch}
                  title="OCR Conversion"
                  description="Optical Character Recognition transforms image text into searchable, structured digital data."
                />
                <ProcessStep 
                  number="04"
                  icon={Database}
                  title="Database Storage"
                  description="Securely ingest structured data into a high-performance HR management database."
                />
                <ProcessStep 
                  number="05"
                  icon={ShieldCheck}
                  title="Verification"
                  description="Manual and automated cross-checks to ensure 100% accuracy of digitized information."
                />
                <ProcessStep 
                  number="06"
                  icon={Lock}
                  title="Security & Backup"
                  description="Applying end-to-end encryption and establishing redundant off-site backups."
                />
              </div>
            </div>

            {/* Right: Records & Tools */}
            <div className="space-y-8">
              <div className="rounded-[2.5rem] bg-slate-50 p-8 sm:p-12">
                <h4 className="font-display text-2xl font-bold tracking-tight text-slate-900 mb-8">Comprehensive Record Sets</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {records.map((record, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-slate-600">{record}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 h-px bg-slate-200" />
                
                <div className="mt-12">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Core Infrastructure Tools</h5>
                  <div className="flex flex-wrap gap-3">
                    {["Industrial Scanners", "High-Perf Computers", "SQL Databases", "HRM Software", "Cloud Infrastructure"].map((tool, i) => (
                      <div key={i} className="rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-amber-500 p-8 text-slate-900">
                  <div className="mb-4 h-10 w-10 rounded-xl bg-slate-900/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Zero-Trust Security</h4>
                  <p className="text-xs text-slate-900/70 leading-relaxed">Advanced biometric and multi-factor authentication for sensitive record access.</p>
                </div>
                <div className="rounded-3xl bg-emerald-800 p-8 text-white">
                  <div className="mb-4 h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">AI Integration</h4>
                  <p className="text-xs text-white/70 leading-relaxed">Predictive analytics for workforce planning and retirement forecasting.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Why Digitalize?</h2>
            <h3 className="font-display text-4xl font-bold tracking-tight text-slate-900">
              Modernizing Government Services
            </h3>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <FeatureCard 
                key={i}
                icon={benefit.icon}
                title={benefit.title}
                items={[benefit.desc]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[3rem] bg-slate-900 p-8 sm:p-16 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_70%)]" />
             <div className="relative z-10 max-w-3xl mx-auto">
                <h4 className="font-display text-3xl font-bold mb-6">Drive the Digital Transformation</h4>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                  The digitalization of employee records is a critical step towards e-Government modernization in Ethiopia, enhancing transparency, accountability, and service delivery across the region.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button className="rounded-full bg-amber-500 px-8 py-4 text-sm font-bold text-slate-900 hover:bg-amber-400 transition-all flex items-center justify-center gap-2">
                      Get Involved <ArrowRight className="h-4 w-4" />
                   </button>
                   <button className="rounded-full bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all">
                      View Technical Docs
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
