import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SAMPLE_COURSES } from '../constants';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, CheckCircle2, ArrowLeft, ChevronRight, Menu, X, Sparkles, Trophy, Loader2, Check } from 'lucide-react';
import { updateEnrollmentProgress, getEnrollment } from '../lib/firestoreService';
import confetti from 'canvas-confetti';

export const CoursePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completionType, setCompletionType] = useState<'lesson' | 'course'>('lesson');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);

  const course = SAMPLE_COURSES.find(c => c.id === id);

  useEffect(() => {
    if (location.state && (location.state as any).activeLessonId) {
      setActiveLessonId((location.state as any).activeLessonId);
    }
  }, [location.state]);

  useEffect(() => {
    if (user && course) {
      const unsubscribe = getEnrollment(user.uid, course.id, (data) => {
        if (data) {
          setEnrollment(data);
          setCompletedLessonIds(data.completedLessons || []);
        }
      });
      return () => unsubscribe();
    }
  }, [user, course]);

  if (!user) return <Navigate to="/login" />;
  if (!course) return <Navigate to="/courses" />;

  const lessons = course.lessons;
  const currentLessonIndex = lessons.findIndex(l => l.id === (activeLessonId || lessons[0].id));
  const activeLesson = lessons[currentLessonIndex];
  const isLessonCompleted = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  const handleCompleteLesson = async () => {
    if (!user || isUpdating || !activeLesson) return;
    
    setIsUpdating(true);
    
    try {
      const newCompletedIds = Array.from(new Set([...completedLessonIds, activeLesson.id]));
      const newProgress = Math.round((newCompletedIds.length / lessons.length) * 100);
      
      await updateEnrollmentProgress(user.uid, course.id, newProgress, newCompletedIds);
      setCompletedLessonIds(newCompletedIds);

      const isAllCompleted = newCompletedIds.length === lessons.length;
      
      if (isAllCompleted) {
        setCompletionType('course');
        setShowSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#ffffff']
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      } else {
        setCompletionType('lesson');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // Auto-advance if not at the end
          if (currentLessonIndex < lessons.length - 1) {
            setActiveLessonId(lessons[currentLessonIndex + 1].id);
          }
        }, 1500);
      }
    } catch (e) {
      console.error('Failed to update progress:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(lessons[currentLessonIndex - 1].id);
    }
  };

  const toggleLessonCompletion = async (lessonId: string) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    try {
      let newCompletedIds: string[];
      if (completedLessonIds.includes(lessonId)) {
        newCompletedIds = completedLessonIds.filter(id => id !== lessonId);
      } else {
        newCompletedIds = Array.from(new Set([...completedLessonIds, lessonId]));
      }
      const newProgress = Math.round((newCompletedIds.length / lessons.length) * 100);
      
      await updateEnrollmentProgress(user.uid, course.id, newProgress, newCompletedIds);
      setCompletedLessonIds(newCompletedIds);

      // Trigger celebration if all completed now and it was just marked complete
      if (newCompletedIds.length === lessons.length && !completedLessonIds.includes(lessonId)) {
        setCompletionType('course');
        setShowSuccess(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#ffffff']
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 4000);
      }
    } catch (e) {
      console.error('Failed to toggle progress:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-white">
      {/* Sidebar */}
      <motion.div 
        animate={{ width: sidebarOpen ? 320 : 0 }}
        className="relative flex-shrink-0 overflow-hidden border-r border-white/5 bg-slate-900"
      >
        <div className="flex h-full w-[320px] flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">{course.title}</h2>
            <div className="mt-2 flex items-center justify-between">
               <span className="text-xs text-slate-400">Course Outline</span>
               <span className="text-[10px] font-bold text-emerald-500">{enrollment?.progress || 0}% Complete</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${enrollment?.progress || 0}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isActive = activeLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition-all ${
                    isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLessonCompletion(lesson.id);
                    }}
                    title={isCompleted ? "Mark incomplete" : "Mark as complete"}
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-emerald-600 cursor-default' 
                        : isCompleted 
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                          : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`truncate text-xs font-bold leading-tight ${isCompleted && !isActive ? 'text-slate-300' : ''}`}>
                      {lesson.title}
                    </p>
                    <p className="mt-1 text-[10px] opacity-60 uppercase tracking-tighter">{lesson.duration}</p>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-950 relative">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="flex flex-col items-center text-center p-8"
              >
                {completionType === 'course' ? (
                  <>
                    <div className="relative mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl"
                      />
                      <div className="relative h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                         <Trophy className="h-12 w-12 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg"
                      >
                         <Sparkles className="h-5 w-5 text-white" />
                      </motion.div>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-2">Congratulations!</h2>
                    <p className="text-xl text-emerald-400 font-medium mb-6">You've completed the entire course!</p>
                    <p className="text-slate-400 max-w-sm">Generating your official Digital Ethiopia certificate now. Redirecting you to your dashboard...</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mb-4 h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Lesson Completed!</h3>
                    <p className="text-slate-400">Great job! Moving to the next lesson...</p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-white/5 text-slate-400 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors">
             <ArrowLeft className="h-4 w-4" />
             Exit Player
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl p-8">
            <div className="aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl relative flex items-center justify-center group">
               <div className="absolute inset-0 bg-slate-800 animate-pulse" />
               <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <PlayCircle className="h-20 w-20 text-emerald-500 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all cursor-pointer" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeLesson?.title}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Ready to start</p>
                  </div>
               </div>
            </div>

            <div className="mt-12">
               <h1 className="text-3xl font-display font-bold text-white tracking-tight">{activeLesson?.title}</h1>
               <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    <PlayCircle className="h-3 w-3" />
                    Now Playing
                  </div>
                  <span className="text-xs text-slate-500">Duration: {activeLesson?.duration}</span>
                  {isLessonCompleted && (
                    <div className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
                    </div>
                  )}
               </div>

               <div className="mt-10 border-t border-white/5 pt-10">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Lesson Description</h4>
                  <p className="text-slate-400 leading-relaxed max-w-3xl">
                    In this lesson, we dive deep into the fundamental concepts of {activeLesson?.title}. 
                    You will learn practical applications and gain hands-on experience through the Digital Ethiopia interactive labs.
                  </p>
               </div>

               <div className="mt-12 flex justify-between gap-4">
                  <button 
                    onClick={handlePreviousLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex-1 rounded-xl bg-white/5 py-4 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous Lesson
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCompleteLesson}
                    disabled={isUpdating || isLessonCompleted}
                    className={`flex-1 rounded-xl py-4 text-xs font-bold uppercase tracking-widest transition-all shadow-xl ${
                      isLessonCompleted 
                      ? 'bg-slate-800 text-emerald-500 cursor-default shadow-none border border-emerald-500/20' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/40 disabled:opacity-50'
                    }`}
                  >
                    {isUpdating ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </div>
                    ) : isLessonCompleted ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Lesson Completed
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                         {currentLessonIndex === lessons.length - 1 ? <Trophy className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                         {currentLessonIndex === lessons.length - 1 ? 'Finish Course' : 'Complete & Next'}
                      </div>
                    )}
                  </motion.button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
