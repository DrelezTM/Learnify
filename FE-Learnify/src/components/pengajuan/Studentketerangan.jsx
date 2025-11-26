import React, { useState, useEffect } from 'react';
import { FileText, Upload, Eye, Clock, CheckCircle, XCircle, AlertCircle, Send, X, Download, Plus } from 'lucide-react';
import { baseAxios } from '@/lib/baseAxios';
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

// Modal Komponen untuk Form Ajukan Surat
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
  };

  const handleClose = () => {
    setFormData({ letter_type: '', reason: '', uploaded_file: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">Ajukan Surat Baru</h2>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Jenis Surat <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.letter_type}
                onChange={(e) => setFormData({...formData, letter_type: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                required
              >
                <option value="">Pilih jenis surat</option>
                {LETTER_TYPES.map((type) => (
                  <option key={type.key} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Alasan Pengajuan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                placeholder="Jelaskan alasan pengajuan surat dengan lengkap..."
                required
              />
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Upload Dokumen Pendukung (Opsional)
              </label>
              <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 transition-all duration-300">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={(e) => setFormData({...formData, uploaded_file: e.target.files[0]})}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-bold text-lg"
                >
                  Pilih file untuk diupload
                </label>
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  {formData.uploaded_file ? (
                    <span className="text-green-600">✓ {formData.uploaded_file.name}</span>
                  ) : (
                    'PDF, DOC, atau gambar (Max 2MB)'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 animate-slide-in" style={{ animationDelay: '400ms' }}>
            <button
              onClick={handleClose}
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

// Modal Komponen untuk Detail Surat
function DetailLetterModal({ isOpen, onClose, letter }) {
  if (!isOpen || !letter) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLetterTypeLabel = (key) => {
    return LETTER_TYPES.find(t => t.key === key)?.label || key;
  };

  const status = STATUS_CONFIG[letter.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="sticky top-0 p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">Detail Surat</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Jenis Surat</label>
            <p className="text-gray-900 mt-2 text-lg font-semibold">{getLetterTypeLabel(letter.letter_type_key)}</p>
          </div>
          
          <div className="animate-slide-in" style={{ animationDelay: '150ms' }}>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Status</label>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${status.color}`}>
                <StatusIcon className="w-5 h-5" />
                {status.label}
              </span>
            </div>
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Alasan</label>
            <p className="text-gray-900 mt-2 leading-relaxed">{letter.reason}</p>
          </div>

          <div className="animate-slide-in" style={{ animationDelay: '250ms' }}>
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Tanggal Pengajuan</label>
            <p className="text-gray-900 mt-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              {formatDate(letter.created_at)}
            </p>
          </div>

          {letter.uploaded_file && (
            <div className="animate-slide-in" style={{ animationDelay: '300ms' }}>
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Dokumen Upload</label>
              <a
                href={letter.uploaded_file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                <Download className="w-5 h-5" />
                Lihat Dokumen
              </a>
            </div>
          )}

          {letter.result_file && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6 animate-slide-in" style={{ animationDelay: '350ms' }}>
              <label className="text-sm font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Hasil Surat Tersedia
              </label>
              <a
                href={letter.result_file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
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
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Ambil user role dari localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    loadLetters(user.role);
  }, []);

  const loadLetters = async (role = userRole) => {
    try {
      setLoading(true);
      
      let endpoint = '/letters'; // default untuk student
      
      if (role === 'admin') {
        endpoint = '/admin/letters';
      } else if (role === 'lecturer') {
        endpoint = '/lecture/approvals';
      }

      const { data } = await baseAxios.get(endpoint);
      setLetters(data);
    } catch (error) {
      console.error('Error loading letters:', error);
      console.error('Error response:', error.response?.data);
      alert('Gagal memuat data surat');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLetter = async (formData) => {
    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('letter_type', formData.letter_type);
      submitData.append('reason', formData.reason);
      if (formData.uploaded_file) {
        submitData.append('uploaded_file', formData.uploaded_file);
      }

      console.log('Submitting form data:', {
        letter_type: formData.letter_type,
        reason: formData.reason,
        has_file: !!formData.uploaded_file
      });

      await baseAxios.post('/letters', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Surat berhasil diajukan!');
      setShowSubmitModal(false);
      loadLetters();
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Gagal mengajukan surat. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      let endpoint = `/letters/${id}`; // default untuk student
      
      if (userRole === 'admin') {
        endpoint = `/admin/letters/${id}`;
      }

      const { data } = await baseAxios.get(endpoint);
      setSelectedLetter(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading detail:', error);
      console.error('Error response:', error.response?.data);
      alert('Gagal memuat detail surat');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLetterTypeLabel = (key) => {
    return LETTER_TYPES.find(t => t.key === key)?.label || key;
  };

  // Hanya student yang bisa ajukan surat
  const canSubmitLetter = userRole === 'student';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    {userRole === 'admin' ? 'Kelola Pengajuan Surat' : 
                     userRole === 'lecturer' ? 'Approval Surat' : 
                     'Pengajuan Surat'}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {userRole === 'admin' 
                      ? 'Kelola semua pengajuan surat dari mahasiswa' 
                      : userRole === 'lecturer'
                      ? 'Kelola approval surat yang membutuhkan persetujuan dosen'
                      : 'Kelola pengajuan surat keterangan Anda dengan mudah'}
                  </p>
                </div>
                {canSubmitLetter && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Ajukan Surat Baru</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Letters List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-800">Daftar Pengajuan Surat</h2>
              <p className="text-gray-600 mt-1">Total {letters.length} pengajuan</p>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 mt-6 text-lg font-medium">Memuat data...</p>
                </div>
              ) : letters.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                    <FileText className="w-12 h-12 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    {userRole === 'lecturer' ? 'Belum ada surat yang perlu di-approve' : 'Belum ada pengajuan surat'}
                  </p>
                  {canSubmitLetter && (
                    <p className="text-gray-500 mt-2">Klik tombol "Ajukan Surat Baru" untuk memulai</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {letters.map((letter, index) => {
                    const status = STATUS_CONFIG[letter.status] || STATUS_CONFIG.pending;
                    const StatusIcon = status.icon;
                    
                    return (
                      <div 
                        key={letter.id} 
                        className="group border-2 border-gray-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm animate-slide-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {getLetterTypeLabel(letter.letter_type_key)}
                              </h3>
                              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${status.color} flex items-center gap-2 transition-all duration-300`}>
                                <StatusIcon className="w-4 h-4" />
                                {status.label}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-700"><span className="font-semibold">Alasan:</span> {letter.reason}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Diajukan pada {formatDate(letter.created_at)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewDetail(letter.id)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-md border border-blue-200"
                          >
                            <Eye className="w-5 h-5" />
                            Lihat Detail
                          </button>
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

      {/* Modals */}
      {canSubmitLetter && (
        <SubmitLetterModal 
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmitLetter}
          submitting={submitting}
        />
      )}

      <DetailLetterModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLetter(null);
        }}
        letter={selectedLetter}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out backwards;
        }
      `}</style>
    </div>
  );
}