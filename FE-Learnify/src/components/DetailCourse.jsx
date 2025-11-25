import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Settings, BookOpen, ChevronDown, FileText, Link, Trash2, RefreshCcw } from 'lucide-react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDetailCourse, fetchProfile } from "@/lib/api";
import AddWeekModal from "./AddWeekModal";
import AddWeekContentModal from "./AddWeekContentModal";
import { formatDeadline } from "@/lib/utils";

export default function DetailCourse() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lecturer, setLecturer] = useState(null);
  const [weeks, setWeeks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("matkul");

  const [showModalAddWeek, setShowModalAddWeek] = useState(false)

  console.log(weeks)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const { data: courseData } = await fetchDetailCourse(id);
        setCourse(courseData);
        setWeeks(courseData.weeks)

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

  const isOwner = user?.id === course?.lecturer_id;

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

        {isOwner && (
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
        p-3 shadow-xl
        rounded-3xl
        border border-gray-200
        bg-white/70 backdrop-blur-lg
        transition-all
      ">

        {/* TAB 1: MATKUL (belum dipakai) */}
        {tab === "matkul" && (
          <>
            {isOwner && (
              <>
                <Button
                  className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                  onClick={() => setShowModalAddWeek(true)}
                >
                  Tambah Pekan
                </Button>

                <AddWeekModal isOpen={showModalAddWeek} courseId={course.id} onClose={() => setShowModalAddWeek(false)} onSuccess={reloadWeeks} />
              </>
            )}

            <WeeksList course={course} weeks={weeks} isOwner={isOwner} />
          </>
        )}

        {/* TAB 2: PENGATURAN */}
        {tab === "pengaturan" && isOwner && (
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

const WeeksList = ({ weeks, isOwner, course, reloadWeeks }) => {
  const [openWeek, setOpenWeek] = useState(null);
  const [showModalWeekContent, setShowModalWeekContent] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const toggleWeek = (weekId) => {
    setOpenWeek(openWeek === weekId ? null : weekId);
  };

  return (
    <div className="space-y-3 mt-5">
      {weeks.map((week) => {
        const isOpen = openWeek === week.id;

        return (
          <div
            key={week.id}
            className="border rounded-xl overflow-hidden shadow-sm bg-white"
          >

            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isOpen ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              onClick={() => toggleWeek(week.id)}
            >
              <h3 className="text-base font-semibold text-gray-800 flex items-center">
                {week.title}

                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-3 h-8 w-8 text-blue-600 hover:bg-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWeekId(week.id);
                      setShowModalWeekContent(true);
                    }}
                    title="Tambah Materi / Assignment"
                  >
                    <Plus size={16} />
                  </Button>
                )}
              </h3>

              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>

            {isOpen && (
              <div className="p-5 space-y-6 bg-white border-t">

                {/* MATERIALS */}
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                    <FileText className="mr-2" size={18} /> Materi
                  </h4>

                  {week.materials?.length === 0 && (
                    <p className="text-sm italic text-gray-500">
                      Belum ada materi untuk pekan ini.
                    </p>
                  )}

                  <div className="space-y-3">
                    {week.materials?.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <h5 className="font-semibold text-gray-800">
                          {mat.title}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {mat.content}
                        </p>

                        {mat.files?.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {mat.files.map((file) => (
                              <a
                                key={file.id}
                                href={file.file_url}
                                target="_blank"
                                className="text-blue-600 underline text-sm flex items-center gap-1"
                              >
                                <Link size={14} /> {file.file_name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ASSIGNMENTS */}
                <div>
                  <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                    <BookOpen className="mr-2" size={18} /> Tugas
                  </h4>

                  {week.assignments?.length === 0 && (
                    <p className="text-sm italic text-gray-500">
                      Belum ada assignment untuk pekan ini.
                    </p>
                  )}

                  <div className="space-y-3">
                    {week.assignments?.map((asg) => (
                      <div
                        key={asg.id}
                        className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <h5 className="font-semibold text-gray-800">
                          {asg.title}
                        </h5>

                        <p className="text-sm text-gray-600 mt-1">
                          {asg.description}
                        </p>

                        <p className="text-xs text-red-600 mt-2 font-medium">
                          Deadline: {formatDeadline(asg.deadline)}
                        </p>

                        {asg.files?.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {asg.files.map((file) => (
                              <a
                                key={file.id}
                                href={file.file_url}
                                target="_blank"
                                className="text-blue-600 underline text-sm flex items-center gap-1"
                              >
                                <Link size={14} /> {file.file_name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        );
      })}

      {selectedWeekId && (
        <AddWeekContentModal
          weekId={selectedWeekId}
          courseId={course.id}
          isOpen={showModalWeekContent}
          onClose={() => setShowModalWeekContent(false)}
          onSuccess={reloadWeeks}
        />
      )}
    </div>
  );
};


const reloadWeeks = async () => {
  try {
    const { data: courseData } = await fetchDetailCourse(id);
    setWeeks(courseData.weeks)
  } catch (err) {
    console.error("Reload failed:", err)
  }
}