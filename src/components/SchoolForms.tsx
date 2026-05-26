import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  UserPlus, 
  MessageSquare, 
  Mail,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { submitForm } from '../lib/firestoreService';
import { useAuth } from '../lib/AuthContext';

type FormType = 'registration' | 'feedback' | 'contact';

export const SchoolForms = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    department: '',
    message: '',
    subject: '',
    rating: '5'
  });

  const formType = (type || 'registration') as FormType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitForm(formType, formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-white p-12 text-center shadow-xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Thank You!</h2>
          <p className="mb-8 text-slate-500 leading-relaxed">
            Your {formType} form has been submitted successfully. Our team will review your request and get back to you shortly.
          </p>
          <button
            onClick={() => navigate('/services')}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg transition-colors hover:bg-emerald-700"
          >
            Back to Services
          </button>
        </motion.div>
      </div>
    );
  }

  const getFormConfig = () => {
    switch (formType) {
      case 'registration':
        return {
          title: "Student Registration",
          subtitle: "Register for the new academic semester",
          icon: UserPlus,
          color: "text-emerald-600"
        };
      case 'feedback':
        return {
          title: "Academic Feedback",
          subtitle: "Help us improve our learning experience",
          icon: MessageSquare,
          color: "text-blue-600"
        };
      case 'contact':
        return {
          title: "Contact Administration",
          subtitle: "Get in touch with our support team",
          icon: Mail,
          color: "text-purple-600"
        };
      default:
        return {
          title: "Institutional Form",
          subtitle: "Please fill out the details below",
          icon: Send,
          color: "text-slate-600"
        };
    }
  };

  const config = getFormConfig();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="mx-auto max-w-2xl">
        <button 
          onClick={() => navigate('/services')}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600"
        >
          <ChevronLeft size={16} /> Back to Services
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-10">
            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ${config.color}`}>
              <config.icon size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{config.title}</h1>
            <p className="mt-2 text-slate-500">{config.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  placeholder="+251 ..."
                />
              </div>
              {formType === 'registration' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="CS">Computer Science</option>
                    <option value="ENG">Engineering</option>
                    <option value="BUS">Business & Economics</option>
                    <option value="MED">Medicine</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                    placeholder="General Inquiry"
                  />
                </div>
              )}
            </div>

            {formType === 'feedback' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Rating (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {formType === 'feedback' ? 'Comments' : 'Message / Details'}
              </label>
              <textarea
                required
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                placeholder="Share your details here..."
              ></textarea>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Submit Form <Send size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
