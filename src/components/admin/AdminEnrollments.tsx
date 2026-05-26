import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Mail, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { getAllEnrollments, getAllUsers, getCourses } from '../../lib/firestoreService';

export const AdminEnrollments = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollments, users, courses] = await Promise.all([
          getAllEnrollments(),
          getAllUsers(),
          getCourses()
        ]);

        const enrichedData = enrollments.map((en: any) => {
          const user = users?.find((u: any) => u.id === en.userId) as any;
          const course = courses?.find((c: any) => c.id === en.courseId) as any;
          return {
            ...en,
            userName: user?.displayName || 'Unknown Student',
            userEmail: user?.email || 'No email',
            courseTitle: course?.title || 'Unknown Course'
          };
        });

        setData(enrichedData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search students or courses..."
          className="w-full rounded-2xl border-none bg-white px-10 py-3 text-xs font-bold uppercase tracking-widest text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bento-card overflow-hidden bg-white border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((row) => (
                <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{row.userName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{row.userEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.courseTitle}</td>
                  <td className="px-6 py-4">
                    {row.progress === 100 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-amber-600">
                        <Clock className="h-2.5 w-2.5" /> Learning
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div 
                            className={`h-full transition-all duration-1000 ${row.progress === 100 ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                            style={{ width: `${row.progress}%` }}
                          />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(row.enrolledAt?.toDate()).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                  <Users className="h-8 w-8" />
               </div>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No student enrollments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
