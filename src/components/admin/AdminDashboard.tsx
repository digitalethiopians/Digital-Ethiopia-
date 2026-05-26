import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Clock, TrendingUp, Award, Activity } from 'lucide-react';
import { getAllUsers, getAllEnrollments, getCourses } from '../../lib/firestoreService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCourses: 0,
    completedEnrollments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, enrollments, courses] = await Promise.all([
          getAllUsers(),
          getAllEnrollments(),
          getCourses()
        ]);

        setStats({
          totalUsers: users?.length || 0,
          totalEnrollments: enrollments?.length || 0,
          totalCourses: courses?.length || 0,
          completedEnrollments: enrollments?.filter((e: any) => e.progress === 100).length || 0
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dummyData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 18 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 25 },
    { name: 'Fri', count: 32 },
    { name: 'Sat', count: 28 },
    { name: 'Sun', count: 20 },
  ];

  const statCards = [
    { label: 'Total Students', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Enrolled', value: stats.totalEnrollments, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Certifications', value: stats.completedEnrollments, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label}
            className="bento-card bg-white p-6"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="mt-1 text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bento-card bg-white p-6 min-h-[400px]">
           <div className="mb-6 flex items-center justify-between">
              <div>
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Enrollment Activity</h3>
                 <p className="text-[10px] text-slate-500 uppercase font-medium">New students in the last 7 days</p>
              </div>
              <Activity className="h-5 w-5 text-emerald-500" />
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={dummyData}>
                 <defs>
                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                   dy={10}
                 />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area 
                   type="monotone" 
                   dataKey="count" 
                   stroke="#10b981" 
                   strokeWidth={3}
                   fillOpacity={1} 
                   fill="url(#colorCount)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bento-card bg-white p-6 flex flex-col justify-between">
           <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">System Health</h3>
              <p className="text-[10px] text-slate-500 uppercase font-medium">Platform performance metrics</p>
           </div>
           
           <div className="space-y-6">
              {[
                { label: 'Database Uptime', value: 99.9, trend: '+0.1%' },
                { label: 'Server Response', value: '42ms', trend: '-2ms' },
                { label: 'Active Sessions', value: 124, trend: '+12%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-lg font-black text-slate-900 tracking-tighter">{item.value}</p>
                   </div>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{item.trend}</span>
                </div>
              ))}
           </div>

           <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                 <Clock className="h-16 w-16" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Upcoming Maintenance</p>
                 <h4 className="font-display text-lg font-bold">Scheduled Update</h4>
                 <p className="mt-2 text-xs text-white/50 leading-relaxed">System optimization planned for May 20th at 02:00 AM UTC.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
