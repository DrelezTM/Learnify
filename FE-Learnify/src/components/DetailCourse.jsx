import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Settings, BookOpen, ChevronDown, FileText, Link, Trash2, RefreshCcw } from 'lucide-react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const currentUserId = 1;

const generateMockSyllabus = () => {
  const syllabus = [];
  for (let i = 1; i <= 16; i++) {
    let title = `Materi Pekan ${i}`;
    let contents = [{ type: 'File', name: `Dokumen Inti Pekan ${i}.pdf` }];

    if (i === 1) {
      title = "Kontrak Perkuliahan";
    } else if (i === 8) {
      title = "Ujian Tengah Semester (UTS)";
      contents = [{ type: 'Link', name: 'Link Ujian UTS' }];
    } else if (i === 16) {
      title = "Ujian Akhir Semester (UAS)";
      contents = [{ type: 'Link', name: 'Link Ujian UAS' }];
    }

    syllabus.push({ week: i, title, contents });
  }
  return syllabus;
};

// Data Mock course (Mengganti fetchDetailCourse)
const mockcourseData = {
  id: "MK101",
  title: "Mata Kuliah Pendidikan Pancasila",
  code: "PANCASILA-A",
  enrollment_key: "LK2024",
  lecturer_id: 1, // Jika 1, user ini adalah dosen pembuat
  lecturer_name: "Dr. Budi Santoso",
  syllabus: generateMockSyllabus(),
};

const SyllabusContent = ({ syllabus, isLecturer }) => {
  // State untuk mengontrol pekan mana yang sedang terbuka (collapse/expand)
  const [openWeek, setOpenWeek] = useState(null);

  const toggleWeek = (week) => {
    setOpenWeek(openWeek === week ? null : week);
  };

  return (
    <div className="space-y-3">
      {syllabus.map((pekan) => {
        const isOpen = openWeek === pekan.week;
        return (
          <div key={pekan.week} className="border rounded-xl overflow-hidden shadow-sm">
            {/* Header Pekan (Klik untuk Toggle) */}
            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isOpen ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => toggleWeek(pekan.week)}
            >
              <h3 className="text-base font-semibold text-gray-800 flex items-center">
                Pekan #{pekan.week} - {pekan.title}
                {isLecturer && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-3 h-8 w-8 text-blue-600 hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    title={`Tambah Konten di Pekan ${pekan.week}`}
                  >
                    <Plus size={16} />
                  </Button>
                )}
              </h3>
              <ChevronDown size={20} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>

            {/* Konten Materi (Conditionally Rendered) */}
            {isOpen && (
              <div className="p-4 pl-8 space-y-3 bg-white border-t">
                {pekan.contents.length > 0 ? (
                  pekan.contents.map((content, index) => {
                    const Icon = content.type === 'File' ? FileText : Link;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-sm text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => console.log(`Buka konten: ${content.name}`)}
                      >
                        <Icon size={16} className="text-blue-500 flex-shrink-0" />
                        <span className="truncate">{content.name}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 italic">Belum ada materi untuk pekan ini.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


const DetailCourse = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("matkul");

  const isLecturer = course && course.lecturer_id === currentUserId;


  useEffect(() => {
    const loadDetail = () => {
      setTimeout(() => {
        setCourse(mockcourseData);
        setLoading(false);
      }, 800);
    };
    loadDetail();
  }, [id]);

  if (loading) return <p className="p-10 text-2xl font-semibold text-blue-600">Memuat Detail course...</p>;
  if (!course) return <p className="p-10 text-red-600 font-medium">Data course tidak ditemukan.</p>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <Card className="p-8 shadow-xl border-l-8 border-blue-600 rounded-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900">{course.title}</h1>
        <p className="text-md text-gray-500 mt-2">Kode course: <span className="font-bold text-gray-700">{course.code}</span></p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Enrollment Key</p>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">{course.enrollment_key}</p>
          </div>

          <div className="p-5 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium uppercase tracking-wider">Dosen Pengajar</p>
            <p className="text-2xl font-extrabold text-purple-900 mt-1">{course.lecturer_name}</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 pt-2 border-b border-gray-200">
        <Button
          variant={tab === "matkul" ? "default" : "ghost"}
          onClick={() => setTab("matkul")}
          className={`font-semibold transition-all rounded-b-none ${tab === "matkul" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-600 hover:text-blue-600"}`}
        >
          <BookOpen size={18} className="mr-2" />
          Materi course ({course.syllabus.length} Pekan)
        </Button>

        {isLecturer && (
          <Button
            variant={tab === "pengaturan" ? "default" : "ghost"}
            onClick={() => setTab("pengaturan")}
            className={`font-semibold transition-all rounded-b-none ${tab === "pengaturan" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-600 hover:text-blue-600"}`}
          >
            <Settings size={18} className="mr-2" />
            Pengaturan
          </Button>
        )}
      </div>

      <Card className="p-6 shadow-xl rounded-t-none rounded-b-xl border border-t-0">
        {tab === "matkul" && (
          <SyllabusContent syllabus={course.syllabus} isLecturer={isLecturer} />
        )}

        {tab === "pengaturan" && isLecturer && (
          <div className="space-y-6">
            <h2 className="font-bold text-2xl text-gray-800 border-b pb-2">Opsi Dosen</h2>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                className="text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-800 font-semibold"
                onClick={() => console.log('Reset Enrollment Key diklik')}
              >
                <RefreshCcw size={16} className="mr-2" />
                Reset Enrollment Key
              </Button>

              <Button
                variant="destructive"
                className="font-semibold"
                onClick={() => console.log('Hapus course diklik')}
              >
                <Trash2 size={16} className="mr-2" />
                Hapus course
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailCourse;