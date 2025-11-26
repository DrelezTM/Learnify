import React, { useState, useEffect } from 'react';
import { FileText, Upload, Eye, Clock, CheckCircle, XCircle, AlertCircle, Send, X, Download, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const LETTER_TYPES = [
  { key: 'surat_keterangan_aktif', label: 'Surat Keterangan Aktif Kuliah' },
  { key: 'surat_izin', label: 'Surat Izin' },
  { key: 'surat_rekomendasi', label: 'Surat Rekomendasi' },
  { key: 'surat_dispensasi', label: 'Surat Dispensasi' }
];

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Admin', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  waiting_lecture: { label: 'Menunggu Dosen', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
  approved: { label: 'Disetujui', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Ditolak', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle }
};

// Dummy data awal
const DUMMY_LETTERS = [
  {
    id: 1,
    letter_type_key: 'surat_keterangan_aktif',
    status: 'pending',
    reason: 'Perlu untuk pengajuan beasiswa semester ini',
    created_at: new Date().toISOString(),
    uploaded_file: null,
    result_file: null
  },
  {
    id: 2,
    letter_type_key: 'surat_izin',
    status: 'approved',
    reason: 'Izin tidak masuk kuliah karena sakit',
    created_at: new Date().toISOString(),
    uploaded_file: null,
    result_file: 'https://example.com/surat_izin.pdf'
  },
  {
    id: 3,
    letter_type_key: 'surat_rekomendasi',
    status: 'rejected',
    reason: 'Butuh rekomendasi dosen untuk lomba',
    created_at: new Date().toISOString(),
    uploaded_file: null,
    result_file: null
  }
];

// Modal Ajukan Surat
function SubmitLetterModal({ isOpen, onClose, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    letter_type: '',
    reason: '',
    uploaded_file: null
  });

  const handleSubmit = () => {
    if (!formData.letter_type || !formData.reason) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    onSubmit(formData);
    setFormData({ letter_type: '', reason: '', uploaded_file: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">Ajukan Surat Baru</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Jenis Surat <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.letter_type}
              onChange={(e) => setFormData({...formData, letter_type: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
            >
              <option value="">Pilih jenis surat</option>
              {LETTER_TYPES.map((type) => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Alasan Pengajuan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
              placeholder="Jelaskan alasan pengajuan surat dengan lengkap..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Upload Dokumen Pendukung (Opsional)</label>
            <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 transition-all duration-300">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <input
                type="file"
                onChange={(e) => setFormData({...formData, uploaded_file: e.target.files[0]})}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-700 font-bold text-lg">
                Pilih file untuk diupload
              </label>
              <p className="text-sm text-gray-600 mt-3 font-medium">
                {formData.uploaded_file ? <span className="text-green-600">✓ {formData.uploaded_file.name}</span> : 'PDF, DOC, atau gambar (Max 2MB)'}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Ajukan Surat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal Detail Surat
function DetailLetterModal({ isOpen, onClose, letter }) {
  if (!isOpen || !letter) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getLetterTypeLabel = (key) => LETTER_TYPES.find(t => t.key === key)?.label || key;
  const status = STATUS_CONFIG[letter.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">Detail Surat</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Jenis Surat</label>
            <p className="text-gray-900 mt-2 text-lg font-semibold">{getLetterTypeLabel(letter.letter_type_key)}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Status</label>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${status.color}`}>
                <StatusIcon className="w-5 h-5" />
                {status.label}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Alasan</label>
            <p className="text-gray-900 mt-2 leading-relaxed">{letter.reason}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Tanggal Pengajuan</label>
            <p className="text-gray-900 mt-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              {formatDate(letter.created_at)}
            </p>
          </div>

          {letter.uploaded_file && (
            <div>
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Dokumen Upload</label>
              <a href={letter.uploaded_file} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                <Download className="w-5 h-5" />
                Lihat Dokumen
              </a>
            </div>
          )}

          {letter.result_file && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6">
              <label className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Hasil Surat Tersedia
              </label>
              <a href={letter.result_file} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105">
                <Download className="w-5 h-5" />
                Download Surat
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen Utama
export default function StudentLetterPage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState('student'); // bisa ganti 'admin' / 'lecturer'

  useEffect(() => {
    // Load dummy letters
    setLetters(DUMMY_LETTERS);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getLetterTypeLabel = (key) => LETTER_TYPES.find(t => t.key === key)?.label || key;

  const canSubmitLetter = userRole === 'student';

  // Ajukan surat baru (dummy)
  const handleSubmitLetter = (formData) => {
    setSubmitting(true);

    const newLetter = {
      id: Date.now(),
      letter_type_key: formData.letter_type,
      status: 'pending',
      reason: formData.reason,
      created_at: new Date().toISOString(),
      uploaded_file: formData.uploaded_file ? URL.createObjectURL(formData.uploaded_file) : null,
      result_file: null
    };

    setLetters((prev) => [newLetter, ...prev]);
    setShowSubmitModal(false);
    setSubmitting(false);
    alert('Surat berhasil diajukan!');
  };

  // Hapus surat
  const handleDeleteLetter = (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus surat ini?');
    if (!confirmDelete) return;

    setLetters((prev) => prev.filter((letter) => letter.id !== id));
    if (selectedLetter?.id === id) {
      setShowDetailModal(false);
      setSelectedLetter(null);
    }
    alert('Surat berhasil dihapus!');
  };

  // Lihat detail surat
  const handleViewDetail = (id) => {
    const letter = letters.find(l => l.id === id);
    setSelectedLetter(letter);
    setShowDetailModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    {userRole === 'admin' ? 'Kelola Pengajuan Surat' : userRole === 'lecturer' ? 'Approval Surat' : 'Pengajuan Surat'}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {userRole === 'admin' ? 'Kelola semua pengajuan surat dari mahasiswa' :
                    userRole === 'lecturer' ? 'Kelola approval surat yang membutuhkan persetujuan dosen' :
                    'Kelola pengajuan surat keterangan Anda dengan mudah'}
                  </p>
                </div>
                {canSubmitLetter && (
                  <button onClick={() => setShowSubmitModal(true)} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Ajukan Surat Baru</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Daftar Surat */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-800">Daftar Pengajuan Surat</h2>
              <p className="text-gray-600 mt-1">Total {letters.length} pengajuan</p>
            </div>
            <div className="p-6">
              {letters.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Belum ada pengajuan surat
                  </p>
                  {canSubmitLetter && (
                    <p className="mt-2 text-gray-400">Klik "Ajukan Surat Baru" untuk menambahkan pengajuan.</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-6">
                  {letters.map((letter) => {
                    const status = STATUS_CONFIG[letter.status] || STATUS_CONFIG.pending;
                    const StatusIcon = status.icon;
                    return (
                      <div key={letter.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-2 border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
                        <div>
                          <h3 className="text-lg font-bold">{getLetterTypeLabel(letter.letter_type_key)}</h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">{letter.reason}</p>
                          <p className="text-sm text-gray-400 mt-1">{formatDate(letter.created_at)}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${status.color}`}>
                            <StatusIcon className="w-5 h-5" />
                            {status.label}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => handleViewDetail(letter.id)} className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-md border border-blue-200">
                              <Eye className="w-5 h-5" /> Lihat Detail
                            </button>
                            {canSubmitLetter && (
                              <button onClick={() => handleDeleteLetter(letter.id)} className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-md border border-rose-200">
                                <XCircle className="w-5 h-5" /> Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubmitLetterModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} onSubmit={handleSubmitLetter} submitting={submitting} />
      <DetailLetterModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} letter={selectedLetter} />
    </div>
  );
}
