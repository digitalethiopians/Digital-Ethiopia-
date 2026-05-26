import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SAMPLE_COURSES } from '../constants';
import { motion } from 'motion/react';
import { BookOpen, Clock, User, CheckCircle, ArrowLeft, PlayCircle, Check, Loader2, Trophy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { updateEnrollmentProgress } from '../lib/firestoreService';
import confetti from 'canvas-confetti';

export const CourseDetail = ({ 
  onEnroll, 
  enrolledCourseIds = [],
  enrollments = []
}: { 
  onEnroll: (id: string) => void, 
  enrolledCourseIds?: string[],
  enrollments?: any[]
}) => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const course = SAMPLE_COURSES.find(c => c.id === id);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
          <Link to="/courses" className="mt-4 inline-block text-emerald-600 hover:underline">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = enrolledCourseIds.includes(course.id);
  const currentEnrollment = enrollments.find(e => e.courseId === course.id);
  const progress = currentEnrollment?.progress || 0;
  const completedLessonIds = currentEnrollment?.completedLessons || [];

  const handleToggleLesson = async (lessonId: string) => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    try {
      let newCompletedIds: string[];
      if (completedLessonIds.includes(lessonId)) {
        newCompletedIds = completedLessonIds.filter(id => id !== lessonId);
      } else {
        newCompletedIds = Array.from(new Set([...completedLessonIds, lessonId]));
      }
      const newProgress = Math.round((newCompletedIds.length / course.lessons.length) * 100);
      
      await updateEnrollmentProgress(user.uid, course.id, newProgress, newCompletedIds);
      
      if (newCompletedIds.length === course.lessons.length && !completedLessonIds.includes(lessonId)) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#ffffff']
        });
      }
    } catch (err) {
      console.error('Failed to update progress from course details:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/courses" className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Link>

      <div className="bento-grid grid-rows-none lg:grid-cols-3">
        {/* Main Header / Intro */}
        <div className="bento-card col-span-1 md:col-span-2 bg-emerald-950 text-white border-none shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="relative z-10">
            <span className="mb-4 inline-block rounded-full bg-emerald-800/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              {course.category} • {course.level}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>
            <p className="mt-6 text-lg text-emerald-100/70 leading-relaxed max-w-2xl">
              {course.longDescription}
            </p>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-100">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-100">{course.lessons.length} Lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card / Progress */}
        <div className="bento-card col-span-1 border-none bg-white shadow-xl shadow-slate-200/50 justify-between">
           <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 mb-6 relative">
              <img 
                src={course.thumbnail} 
                className="h-full w-full object-cover" 
                alt={course.title} 
                referrerPolicy="no-referrer"
              />
              {isEnrolled && progress === 100 && (
                <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white text-emerald-600 p-3 rounded-full shadow-lg">
                    <Trophy className="h-8 w-8" />
                  </div>
                </div>
              )}
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-3xl font-black text-slate-900 tracking-tighter">FREE</span>
                 {isEnrolled ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                       {progress}% Completed
                    </div>
                 ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       Active Learning
                    </div>
                 )}
              </div>

              {isEnrolled && (
                <div className="my-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{completedLessonIds.length} of {course.lessons.length} completed</span>
                  </div>
                </div>
              )}

              {isEnrolled ? (
                <Link 
                  to={`/learn/${course.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <PlayCircle className="h-5 w-5" />
                  {progress === 100 ? 'Review Lessons' : 'Continue Learning'}
                </Link>
              ) : (
                <button
                  onClick={() => onEnroll(course.id)}
                  className="w-full rounded-xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                >
                  Enroll in Course
                </button>
              )}
              
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                LIFETIME ACCESS • CERTIFICATE INCLUDED
              </p>
           </div>
        </div>

        {/* Prerequisites */}
        <div className="bento-card col-span-1 md:col-span-2">
          <h3 className="mb-6 font-display text-xl font-bold text-slate-900 flex items-center gap-2">
             <CheckCircle className="h-5 w-5 text-emerald-500" />
             Course Prerequisites
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {course.prerequisites.map((req, i) => (
              <div key={i} className="flex gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                   {i + 1}
                </div>
                <span className="text-sm font-medium text-slate-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Curriculum & Progress Tracking */}
        <div className="bento-card col-span-1 md:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Course Curriculum
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {course.lessons.length} Lessons • {course.duration} Total
              </p>
            </div>
            
            {isEnrolled && (
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Your Progress</p>
                  <p className="text-emerald-700 font-display font-medium text-sm mt-0.5">{progress}% Complete</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              
              return (
                <div 
                  key={lesson.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50/20 border-emerald-100 animate-fade-in' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isEnrolled ? (
                      <button
                        onClick={() => handleToggleLesson(lesson.id)}
                        disabled={isUpdating}
                        className={`group flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 shadow-sm shrink-0 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-200 bg-white hover:border-emerald-400 text-transparent hover:text-emerald-500'
                        }`}
                        title={isCompleted ? "Mark incomplete" : "Mark as complete"}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        ) : isCompleted ? (
                          <Check className="h-5 w-5 stroke-[3]" />
                        ) : (
                          <Check className="h-4 w-4 stroke-[3] opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                    )}
                    
                    <div>
                      <h4 className={`text-sm font-bold leading-snug ${isCompleted ? 'text-slate-800 line-through decoration-slate-300' : 'text-slate-900'}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5 tracking-wider">{lesson.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {isEnrolled && (
                      <Link
                        to={`/learn/${course.id}`}
                        state={{ activeLessonId: lesson.id }}
                        className="text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 hover:border-emerald-600 transition-all uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Play
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Instructor Section */}
        <div className="bento-card col-span-1 md:col-span-3 border-none bg-white overflow-hidden p-0 shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 lg:w-1/4 h-80 md:h-auto overflow-hidden">
               <img 
                 src={course.instructorPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60'} 
                 className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                 alt={course.instructor} 
               />
            </div>
            <div className="flex-1 p-8 lg:p-12">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-4 inline-block">Learn from the Expert</span>
               <h3 className="font-display text-3xl font-bold text-slate-900 mb-2">Meet Your Instructor</h3>
               <div className="flex items-center gap-2 mb-6">
                 <p className="text-xl font-bold text-slate-900">{course.instructor}</p>
                 <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{course.category} Lead</p>
               </div>
               
               <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-8">
                 {course.instructorBio}
               </p>

               <div className="flex gap-4">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
                     <BookOpen className="h-4 w-4 text-emerald-600" />
                     <span className="text-xs font-bold text-slate-600">12 Courses</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-100">
                     <User className="h-4 w-4 text-blue-600" />
                     <span className="text-xs font-bold text-slate-600">1.2k Students</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
