import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Paperclip,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { submitAssignment, getAssignments, getCourses } from '../lib/firestoreService';

export const Assignments = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [title, setTitle] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData || []);
        
        const unsubAssignments = getAssignments(user.uid, (data) => {
          setAssignments(data);
          setLoading(false);
        });
        
        return unsubAssignments;
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCourse) return;
    
    setIsSubmitting(true);
    try {
      const course = courses.find(c => c.id === selectedCourse);
      await submitAssignment({
        courseId: selectedCourse,
        courseTitle: course?.title || 'Unknown Course',
        title,
        fileLink,
        userName: user.displayName,
      });
      
      setTitle('');
      setSelectedCourse('');
      setFileLink('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Assignments</h1>
          <p className="mt-2 text-slate-500">Submit your coursework and track your submission history.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <Upload size={20} className="text-emerald-600" /> New Submission
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Course</label>
                  <select
                    required
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assignment Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Final Project Report"
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">File Link (Drive/Cloud)</label>
                  <div className="relative">
                    <Paperclip size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="url"
                      value={fileLink}
                      onChange={(e) => setFileLink(e.target.value)}
                      placeholder="https://docs.google.com/..."
                      className="w-full rounded-xl border border-slate-100 bg-slate-50 pl-11 pr-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-600 py-4 font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {showSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 size={20} /> Submitted!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Upload size={18} /> Submit Solution</>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>
          </div>

          {/* Submission History */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-900">
                <Clock size={20} className="text-blue-600" /> Submission History
              </h2>

              {assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 rounded-full bg-slate-50 p-4 text-slate-300">
                    <FileText size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No submissions yet</h3>
                  <p className="max-w-[240px] text-sm text-slate-400 mt-1">Start by submitting your first assignment on the left.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment, idx) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex flex-col gap-4 rounded-2xl border border-slate-50 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{assignment.title}</h4>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                              {assignment.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{assignment.courseTitle}</p>
                          <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> 
                              {assignment.submittedAt?.toDate().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <a 
                        href={assignment.fileLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        View Submission
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
