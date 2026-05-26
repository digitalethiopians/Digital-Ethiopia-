import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, ExternalLink, X, Save } from 'lucide-react';
import { getCourses, saveCourse, deleteCourse } from '../../lib/firestoreService';
import { Course, Lesson } from '../../constants';

export const AdminCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editingCourse?.title?.trim()) {
      newErrors.title = 'Course title is required';
    } else if (editingCourse.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!editingCourse?.description?.trim()) {
      newErrors.description = 'Short description is required';
    } else if (editingCourse.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!editingCourse?.longDescription?.trim()) {
      newErrors.longDescription = 'Detailed description is required';
    }

    if (!editingCourse?.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!editingCourse?.instructor?.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    if (!editingCourse?.thumbnail?.trim()) {
      newErrors.thumbnail = 'Thumbnail URL is required';
    } else {
      try {
        new URL(editingCourse.thumbnail);
      } catch {
        newErrors.thumbnail = 'Please enter a valid URL';
      }
    }

    if (!editingCourse?.duration?.trim()) {
      newErrors.duration = 'Duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCourses = async () => {
    setLoading(true);
    const data = await getCourses();
    setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    
    if (!validateForm()) return;

    try {
      await saveCourse(editingCourse);
      setIsModalOpen(false);
      setEditingCourse(null);
      setErrors({});
      fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full rounded-2xl border-none bg-white px-10 py-3 text-xs font-bold uppercase tracking-widest text-slate-900 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setEditingCourse({
              title: '',
              description: '',
              longDescription: '',
              thumbnail: '',
              instructor: '',
              instructorBio: '',
              category: '',
              level: 'Beginner',
              prerequisites: [],
              duration: '',
              lessons: []
            });
            setErrors({});
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      <div className="bento-card overflow-hidden bg-white border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Lessons</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <img src={course.thumbnail} className="h-full w-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{course.title}</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600">{course.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{course.instructor}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{course.lessons?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => {
                          setEditingCourse(course);
                          setErrors({});
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-emerald-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                         <Edit2 className="h-4 w-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(course.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCourses.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                  <Search className="h-8 w-8" />
               </div>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No courses found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {editingCourse?.id ? 'Edit Course' : 'Create New Course'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 hover:bg-slate-50">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Course Title</label>
                        <input
                          className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.title ? 'border-red-400 bg-red-50' : ''}`}
                          value={editingCourse?.title || ''}
                          onChange={e => {
                            setEditingCourse({...editingCourse, title: e.target.value});
                            if (errors.title) setErrors({...errors, title: ''});
                          }}
                        />
                        {errors.title && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.title}</p>}
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Short Description</label>
                        <textarea
                          className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.description ? 'border-red-400 bg-red-50' : ''}`}
                          rows={2}
                          value={editingCourse?.description || ''}
                          onChange={e => {
                            setEditingCourse({...editingCourse, description: e.target.value});
                            if (errors.description) setErrors({...errors, description: ''});
                          }}
                        />
                        {errors.description && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.description}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                            <input
                              className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.category ? 'border-red-400 bg-red-50' : ''}`}
                              value={editingCourse?.category || ''}
                              onChange={e => {
                                setEditingCourse({...editingCourse, category: e.target.value});
                                if (errors.category) setErrors({...errors, category: ''});
                              }}
                            />
                            {errors.category && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.category}</p>}
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Level</label>
                            <select
                              className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0"
                              value={editingCourse?.level || 'Beginner'}
                              onChange={e => setEditingCourse({...editingCourse, level: e.target.value})}
                            >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Thumbnail URL</label>
                        <input
                          className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.thumbnail ? 'border-red-400 bg-red-50' : ''}`}
                          value={editingCourse?.thumbnail || ''}
                          onChange={e => {
                            setEditingCourse({...editingCourse, thumbnail: e.target.value});
                            if (errors.thumbnail) setErrors({...errors, thumbnail: ''});
                          }}
                        />
                        {errors.thumbnail && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.thumbnail}</p>}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Detailed Bio (Long Description)</label>
                         <textarea
                           className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.longDescription ? 'border-red-400 bg-red-50' : ''}`}
                           rows={5}
                           value={editingCourse?.longDescription || ''}
                           onChange={e => {
                             setEditingCourse({...editingCourse, longDescription: e.target.value});
                             if (errors.longDescription) setErrors({...errors, longDescription: ''});
                           }}
                         />
                         {errors.longDescription && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.longDescription}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instructor Name</label>
                            <input
                              className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.instructor ? 'border-red-400 bg-red-50' : ''}`}
                              value={editingCourse?.instructor || ''}
                              onChange={e => {
                                setEditingCourse({...editingCourse, instructor: e.target.value});
                                if (errors.instructor) setErrors({...errors, instructor: ''});
                              }}
                            />
                            {errors.instructor && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.instructor}</p>}
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration (e.g., 4 Weeks)</label>
                            <input
                              className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-0 ${errors.duration ? 'border-red-400 bg-red-50' : ''}`}
                              value={editingCourse?.duration || ''}
                              onChange={e => {
                                setEditingCourse({...editingCourse, duration: e.target.value});
                                if (errors.duration) setErrors({...errors, duration: ''});
                              }}
                            />
                            {errors.duration && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.duration}</p>}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end gap-4 border-t border-slate-100 pt-8">
                     <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-2xl border border-slate-200 px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <Save className="h-4 w-4" />
                        Save Course
                      </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
