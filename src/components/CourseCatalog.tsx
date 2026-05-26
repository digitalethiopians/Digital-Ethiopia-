import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CourseCard } from './CourseCard';

export const CourseCatalog = ({ onEnrollCourse, enrolledCourseIds = [] }: { onEnrollCourse: (id: string) => void, enrolledCourseIds?: string[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All Levels');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = () => {
      try {
        const q = query(collection(db, 'courses'));
        return onSnapshot(q, (snapshot) => {
          setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        }, (error) => {
          console.error('Failed to fetch courses:', error);
          setLoading(false);
        });
      } catch (err) {
        console.error('Failed to setup courses listener:', err);
        setLoading(false);
      }
    };
    const unsubscribe = fetchCourses();
    return () => unsubscribe && unsubscribe();
  }, []);

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesLevel = activeLevel === 'All Levels' || course.level === activeLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
        >
          Empower Your <span className="text-emerald-600">Future</span>
        </motion.h2>
        <p className="mt-4 text-sm font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
          Discover courses designed to prepare you for the digital world.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="relative flex flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 md:flex-nowrap">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-100'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          <div className="flex flex-wrap gap-2">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeLevel === level
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={() => onEnrollCourse(course.id)}
                enrolled={enrolledCourseIds.includes(course.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-zinc-100 p-6 text-zinc-300">
            <BookOpen className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">No courses found</h3>
          <p className="mt-2 text-zinc-500">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};
