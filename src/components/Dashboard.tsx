import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getEnrollments, getCertificates, updateEnrollmentProgress, getCourses } from '../lib/firestoreService';
import { CourseCard } from './CourseCard';
import { BookOpen, AlertCircle, Award, Calendar, ChevronRight, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { SAMPLE_COURSES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { CertificateModal } from './CertificateModal';
import { motion, AnimatePresence } from 'motion/react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchCoursesAndData = async () => {
      if (!user) return;
      
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        const unsubEnroll = getEnrollments(user.uid, (data) => {
          setEnrollments(data);
          setLoading(false);
        });
        const unsubCert = getCertificates(user.uid, (data) => {
          setCertificates(data);
        });
        
        return () => {
          unsubEnroll();
          unsubCert();
        };
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchCoursesAndData();
  }, [user]);

  const handleUpdateProgress = async (courseId: string) => {
    if (!user) return;
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment) return;
    const newProgress = (enrollment.progress || 0) + 10;
    try {
      await updateEnrollmentProgress(user.uid, courseId, newProgress);
    } catch (e) {
      console.error(e);
    }
  };

  const enrolledCourses = courses.map(c => {
    const enrollment = enrollments.find(e => e.courseId === c.id);
    if (enrollment) {
      return { ...c, progress: enrollment.progress || 0 };
    }
    return null;
  }).filter(Boolean) as any[];

  if (loading && enrollments.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 uppercase tracking-widest font-medium">Continue your learning journey.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100 shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-Sync Ready
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all shadow-sm ${
            isOnline 
              ? 'bg-blue-50 text-blue-600 border-blue-100' 
              : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
          }`}>
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline Access Active'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            My Active Courses
          </h3>

          {enrolledCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {enrolledCourses.map(course => (
                   <CourseCard 
                     key={course.id} 
                     course={course} 
                     enrolled={true} 
                     onContinue={() => navigate(`/learn/${course.id}`)}
                   />
                ))}
            </div>
          ) : (
            <div className="bento-card border-dashed bg-slate-50 py-20 text-center items-center justify-center">
               <p className="text-sm font-medium text-slate-400">You haven't enrolled in any courses yet.</p>
               <button 
                 onClick={() => navigate('/courses')}
                 className="mt-4 text-xs font-bold text-emerald-600 hover:underline uppercase tracking-widest"
               >
                 Browse Catalog
               </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bento-card bg-emerald-950 text-white border-none shadow-xl">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 opacity-80">My Certificates</h4>
                 <Award className="h-4 w-4 text-emerald-500" />
              </div>
              
              <div className="space-y-3">
                 {certificates.length > 0 ? (
                   certificates.map((cert) => (
                     <motion.button
                       initial={{ opacity: 0, x: 10 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       key={cert.id}
                       onClick={() => setSelectedCert(cert)}
                       className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left border border-white/10 hover:bg-white/10 transition-all group"
                     >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                           <Award className="h-4 w-4" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="truncate text-xs font-bold text-white leading-tight">{cert.courseTitle}</p>
                           <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Verified Award</p>
                        </div>
                        <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-emerald-400 transition-colors" />
                     </motion.button>
                   ))
                 ) : (
                   <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Complete a course to earn certificates</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bento-card bg-white">
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Announcements</h4>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                       <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                       <h5 className="text-xs font-bold text-slate-800 leading-tight">Hackathon 2026</h5>
                       <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Registration opens Friday</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <CertificateModal 
        cert={selectedCert} 
        isOpen={!!selectedCert} 
        onClose={() => setSelectedCert(null)} 
      />
    </div>
  );
};
