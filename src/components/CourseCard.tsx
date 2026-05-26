import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    category: string;
    level: string;
    price?: number;
    progress?: number;
  };
  onEnroll?: () => void;
  onContinue?: () => void;
  enrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, onContinue, enrolled }) => {
  const isCompleted = enrolled && course.progress === 100;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bento-card relative overflow-hidden bg-white shadow-sm hover:shadow-md h-full"
    >
      <Link to={`/courses/${course.id}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
          <img
            src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60`}
            alt={course.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isCompleted ? 'opacity-70' : ''}`}
            referrerPolicy="no-referrer"
          />
          
          {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xl"
              >
                <CheckCircle2 size={32} />
              </motion.div>
            </div>
          )}

          {enrolled && course.progress !== undefined && !isCompleted && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/40 via-transparent to-transparent p-4">
              <div className="w-full">
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-wider">
                  <span>Course Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    className="h-full bg-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            {course.category}
          </span>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {course.level}
          </div>
        </div>

        <Link to={`/courses/${course.id}`}>
          <h3 className="mb-2 font-display text-lg font-bold leading-tight text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
            {course.title}
            {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
          </h3>
        </Link>
        
        <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {course.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-100">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} alt={course.instructor} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{course.instructor}</span>
          </div>
          
          {enrolled ? (
            <button
               onClick={onContinue}
               className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                 isCompleted 
                   ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                   : 'bg-emerald-50 bg-opacity-100 text-emerald-600 hover:bg-emerald-100'
               }`}
            >
              {isCompleted ? 'Completed' : 'Continue'}
            </button>
          ) : (
            <button
              onClick={onEnroll}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest"
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
