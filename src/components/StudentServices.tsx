import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  FileEdit, 
  ClipboardList, 
  UserPlus, 
  MessageSquare, 
  Mail, 
  ArrowRight,
  GraduationCap,
  Globe,
  Building2,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  color = "emerald" 
}: any) => {
  const navigate = useNavigate();
  
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(path)}
      className={`cursor-pointer rounded-2xl border p-8 transition-all duration-300 ${colors[color]}`}
      id={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900">{title}</h3>
      <p className="mb-6 text-sm text-slate-500 leading-relaxed">{description}</p>
      <div className="flex items-center text-sm font-bold uppercase tracking-wider">
        Access Now <ArrowRight size={16} className="ml-2" />
      </div>
    </motion.div>
  );
};

export const StudentServices = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Student Portal",
      description: "Your personalized dashboard for courses, progress, and performance tracking.",
      icon: User,
      path: "/dashboard",
      color: "emerald"
    },
    {
      title: "Online Learning",
      description: "Explore our comprehensive library of vocational and industrial courses.",
      icon: BookOpen,
      path: "/courses",
      color: "blue"
    },
    {
      title: "Online Assignments",
      description: "Submit your work and track feedback from instructors in real-time.",
      icon: FileEdit,
      path: "/assignments",
      color: "purple"
    },
    {
      title: "School Forms",
      description: "Access and submit institutional forms, registration, and administrative requests.",
      icon: ClipboardList,
      path: "/forms",
      color: "orange"
    }
  ];

  const subForms = [
    { name: "Student Registration", icon: UserPlus, path: "/forms/registration" },
    { name: "Feedback Form", icon: MessageSquare, path: "/forms/feedback" },
    { name: "Contact Administration", icon: Mail, path: "/forms/contact" }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <GraduationCap size={40} />
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
               Student <span className="text-emerald-400">Services</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              A comprehensive suite of digital tools designed to support your academic journey, 
              from admission to graduation and career placement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <ServiceCard 
              key={idx} 
              title={service.title}
              description={service.description}
              icon={service.icon}
              path={service.path}
              color={service.color}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Forms */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Institutional Forms</h2>
            <p className="mt-4 text-slate-500">Quick access to essential administrative forms and contact channels.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {subForms.map((form, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(form.path)}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:bg-slate-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                  <form.icon size={24} />
                </div>
                <span className="font-bold text-slate-700">{form.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Useful Links Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Globe size={12} /> External Resources
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Need more information?</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Explore our curated directory of external links, government portals, 
                and academic resources to support your research and development goals.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/resources')}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800"
              >
                Explore Links Directory <ArrowRight size={16} />
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              {[
                { label: 'Ethiopian Gov', icon: Building2 },
                { label: 'MOE Ethiopia', icon: GraduationCap },
                { label: 'Jimma Uni', icon: BookOpen },
                { label: 'GitHub', icon: Code }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <item.icon size={24} className="text-emerald-600 mb-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
