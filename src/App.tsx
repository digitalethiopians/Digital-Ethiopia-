import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './Hero';
import { CourseCatalog } from './components/CourseCatalog';
import { Dashboard } from './components/Dashboard';
import { CourseDetail } from './components/CourseDetail';
import { CoursePlayer } from './components/CoursePlayer';
import { LoginPage } from './components/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminCourses } from './components/admin/AdminCourses';
import { AdminEnrollments } from './components/admin/AdminEnrollments';
import { AdminGovernment } from './components/admin/AdminGovernment';
import { VisionSection } from './components/VisionSection';
import { GovernmentDigitalization } from './components/GovernmentDigitalization';
import { VerifyCertificate } from './components/VerifyCertificate';
import { AIChatbot } from './components/AIChatbot';
import { StudentServices } from './components/StudentServices';
import { SchoolForms } from './components/SchoolForms';
import { Assignments } from './components/Assignments';
import { Resources } from './components/Resources';
import { enrollInCourse, syncUser, seedCourses, getEnrollments } from './lib/firestoreService';
import { useEffect, useState } from 'react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const handleSync = async () => {
      if (user) {
        await syncUser(user);
        if (user.email === 'digitaloromiya@gmail.com' || user.uid === 'd0W2QF71NcXSCeF3qQxuVrRFqqx1') {
          await seedCourses();
        }
      }
    };
    
    handleSync();

    if (user) {
      const unsubscribe = getEnrollments(user.uid, (data) => {
        setEnrollments(data);
        setEnrolledIds(data.map(e => e.courseId));
      });
      return unsubscribe;
    }
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      alert('Please sign in to enroll in courses!');
      return;
    }
    try {
      await enrollInCourse(user.uid, courseId);
      alert('Enrolled successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-white">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-orange-600"></div>
       </div>
     );
  }

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 pb-20">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <VisionSection />
              <CourseCatalog onEnrollCourse={handleEnroll} enrolledCourseIds={enrolledIds} />
            </>
          } />
          <Route path="/courses" element={<CourseCatalog onEnrollCourse={handleEnroll} />} />
          <Route path="/courses/:id" element={<CourseDetail onEnroll={handleEnroll} enrolledCourseIds={enrolledIds} enrollments={enrollments} />} />
          <Route path="/learn/:id" element={<CoursePlayer />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/" />
          } />
          <Route path="/services" element={<StudentServices />} />
          <Route path="/forms" element={<SchoolForms />} />
          <Route path="/forms/:type" element={<SchoolForms />} />
          <Route path="/assignments" element={
            user ? <Assignments /> : <Navigate to="/login" />
          } />
          <Route path="/assistant" element={<AIChatbot />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/government" element={<GovernmentDigitalization />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="students" element={<AdminEnrollments />} />
            <Route path="government" element={<AdminGovernment />} />
          </Route>
        </Routes>
        
        <footer className="mt-20 border-t border-slate-200 bg-white py-14">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
              <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
                 <div className="flex flex-col items-center gap-4 sm:items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 font-display text-sm font-bold text-white uppercase tracking-tighter">
                      DE
                    </div>
                    <p className="text-sm font-bold text-slate-800">Digital Ethiopia Initiative</p>
                    <p className="max-w-xs text-xs leading-relaxed text-slate-400">Modernizing Universities and Vocational Education across Ethiopia and the world through digitalization, ensuring global standards and academic excellence.</p>
                 </div>
                 <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <a href="/government" className="hover:text-emerald-700 transition-colors">Digital Government</a>
                    <a href="/resources" className="hover:text-emerald-700 transition-colors">Resources</a>
                    <a href="/assistant" className="hover:text-emerald-700 transition-colors">AI Assistant</a>
                    <a href="/verify" className="hover:text-emerald-700 transition-colors">Verification</a>
                    <a href="#" className="hover:text-emerald-700 transition-colors">Support</a>
                 </div>
              </div>
              <div className="mt-12 border-t border-slate-50 pt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                 © 2026 Digital Ethiopia Initiative. All rights reserved.
              </div>
           </div>
        </footer>
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
