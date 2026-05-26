import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  User, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  FileText, 
  Upload, 
  Scan, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getGovernmentRecords, saveGovernmentRecord } from '../../lib/firestoreService';
import { motion, AnimatePresence } from 'motion/react';

interface GovRecord {
  id?: string;
  employeeId: string;
  fullName: string;
  position: string;
  educationalBackground: string;
  workExperience: string;
  salary: number;
  governmentServiceRecord: string;
  benefits: string;
}

export const AdminGovernment = () => {
  const [records, setRecords] = useState<GovRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<GovRecord> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchRecords = async () => {
    setLoading(true);
    const data = await getGovernmentRecords();
    setRecords(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!editingRecord?.employeeId?.trim()) newErrors.employeeId = 'Required';
    if (!editingRecord?.fullName?.trim()) newErrors.fullName = 'Required';
    if (!editingRecord?.position?.trim()) newErrors.position = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await saveGovernmentRecord(editingRecord);
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRecords = records.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Digitalized', value: records.length, icon: Database, color: 'text-emerald-600' },
          { label: 'Agencies Syncing', value: '12', icon: RefreshCw, color: 'text-blue-600' },
          { label: 'Integrity Rate', value: '99.9%', icon: ShieldCheck, color: 'text-purple-600' },
          { label: 'Paper Saved', value: `${(records.length * 15).toLocaleString()} lbs`, icon: FileText, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Government Records</h2>
          <p className="text-sm text-slate-500">Manage and digitize employee information across government agencies.</p>
        </div>
        <button 
          onClick={() => {
            setEditingRecord({
              employeeId: `EMP-${Math.floor(Math.random() * 100000)}`,
              fullName: '',
              position: '',
              educationalBackground: '',
              workExperience: '',
              salary: 0,
              governmentServiceRecord: '',
              benefits: ''
            });
            setErrors({});
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95"
        >
          <Scan className="h-4 w-4" />
          Digitize New Record
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name, ID or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border-slate-100 bg-white py-4 pl-12 pr-4 text-sm font-medium transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecords.map((record) => (
            <motion.div 
              layout
              key={record.id}
              className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{record.fullName}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{record.position}</p>
              
              <div className="space-y-3 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-500">ID: {record.employeeId}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-600">{record.workExperience || 'Experience log available'}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => {
                    setEditingRecord(record);
                    setErrors({});
                    setIsModalOpen(true);
                  }}
                  className="flex-1 rounded-xl bg-slate-50 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Edit Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Digitization Entry</h3>
                    <p className="text-sm text-slate-400">Convert physical documents to digital records.</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Scan className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="max-h-[70vh] overflow-y-auto p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</label>
                    <input
                      className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0 ${errors.employeeId ? 'border-red-400 bg-red-50' : ''}`}
                      value={editingRecord?.employeeId || ''}
                      onChange={e => setEditingRecord({...editingRecord, employeeId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                    <input
                      className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0 ${errors.fullName ? 'border-red-400 bg-red-50' : ''}`}
                      value={editingRecord?.fullName || ''}
                      onChange={e => setEditingRecord({...editingRecord, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Position</label>
                    <input
                      className={`w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0 ${errors.position ? 'border-red-400 bg-red-50' : ''}`}
                      value={editingRecord?.position || ''}
                      onChange={e => setEditingRecord({...editingRecord, position: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Academic Background</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0"
                      value={editingRecord?.educationalBackground || ''}
                      onChange={e => setEditingRecord({...editingRecord, educationalBackground: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Work History & Experience</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-2xl border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:border-emerald-500 focus:ring-0"
                      value={editingRecord?.workExperience || ''}
                      onChange={e => setEditingRecord({...editingRecord, workExperience: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-2xl border border-slate-200 py-4 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-emerald-600 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-colors"
                  >
                    Save Digital Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
