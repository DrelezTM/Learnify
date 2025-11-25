import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Settings, BookOpen, ChevronDown, FileText, Link, Trash2, RefreshCcw } from 'lucide-react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDetailCourse, fetchProfile } from "@/lib/api";

export default function DetailCourse() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("matkul");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const { data: courseData } = await fetchDetailCourse(id);
        setCourse(courseData);

        if (courseData) {
          const { data: lecturerData } = await fetchProfile(courseData.lecturer_id);
          setLecturer(lecturerData);
        }

      } catch (error) {
        console.error("Failed load detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-2xl font-semibold text-blue-600 animate-pulse">
        Memuat detail course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center text-red-600 font-medium">
        Data course tidak ditemukan.
      </div>
    );
  }

  const isLecturer = user?.id === course.lecturer_id;

  return (
    <div className="p-8 space-y-8 w-full mx-16">

      {/* HEADER CARD */}
      <Card className="
        p-10
        shadow-lg
        rounded-3xl
        bg-white/30
        backdrop-blur-xl
        border border-white/40
        transition-all
      ">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          {course.title}
        </h1>

        <p className="text-lg text-gray-600 mt-2">
          Kode Course:{" "}
          <span className="font-bold text-gray-900">{course.code}</span>
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

          {/* Enrollment Key */}
          <div className="
            p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100
            shadow-md hover:shadow-lg transition-all
          ">
            <p className="text-xs text-blue-700 uppercase tracking-wider font-semibold">
              Enrollment Key
            </p>
            <p className="text-3xl font-extrabold text-blue-900 mt-1">
              {course.enrollment_key}
            </p>
          </div>

          {/* Lecturer */}
          <div className="
            p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100
            shadow-md hover:shadow-lg transition-all
          ">
            <p className="text-xs text-purple-700 uppercase tracking-wider font-semibold">
              Dosen Pengajar
            </p>
            <p className="text-3xl font-extrabold text-purple-900 mt-1">
              {lecturer?.name || "Nama dosen tidak ditemukan"}
            </p>
          </div>

        </div>
      </Card>

      {/* TABS */}
      <div className="flex gap-2 pt-2 border-b border-gray-200">
        <Button
          variant={tab === "matkul" ? "default" : "ghost"}
          onClick={() => setTab("matkul")}
          className={`
            font-semibold rounded-b-none px-6 py-2
            transition-all
            ${tab === "matkul"
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              : "text-gray-600 hover:text-blue-600"
            }
          `}
        >
          <BookOpen size={20} className="mr-2" />
          Materi Course
        </Button>

        {isLecturer && (
          <Button
            variant={tab === "pengaturan" ? "default" : "ghost"}
            onClick={() => setTab("pengaturan")}
            className={`
              font-semibold rounded-b-none px-6 py-2
              transition-all
              ${tab === "pengaturan"
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                : "text-gray-600 hover:text-blue-600"
              }
            `}
          >
            <Settings size={20} className="mr-2" />
            Pengaturan
          </Button>
        )}
      </div>

      {/* TAB CONTENT */}
      <Card className="
        p-8 shadow-xl
        rounded-3xl
        border border-gray-200
        bg-white/70 backdrop-blur-lg
        transition-all
      ">

        {/* TAB 1: MATKUL (belum dipakai) */}
        {tab === "matkul" && (
          <div className="text-center text-gray-500 py-10 italic">
            Silabus belum tersedia.
          </div>
        )}

        {/* TAB 2: PENGATURAN */}
        {tab === "pengaturan" && isLecturer && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
              Pengaturan Dosen
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">

              {/* Reset Key */}
              <Button
                variant="outline"
                className="
                  text-yellow-700 border-yellow-300 bg-yellow-50
                  hover:bg-yellow-100 hover:text-yellow-800
                  font-semibold shadow-sm
                "
              >
                <RefreshCcw size={18} className="mr-2" />
                Reset Enrollment Key
              </Button>

              {/* Hapus Course */}
              <Button
                variant="destructive"
                className="font-semibold shadow-sm"
              >
                <Trash2 size={18} className="mr-2" />
                Hapus Course
              </Button>

            </div>
          </div>
        )}

      </Card>

    </div>
  );
}

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

const SyllabusContent = ({ syllabus, isLecturer }) => {
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