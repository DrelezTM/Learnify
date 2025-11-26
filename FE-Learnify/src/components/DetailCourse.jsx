import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  BookOpen,
  ChevronDown,
  FileText,
  Link as LinkIcon,
  Pencil,
  Trash,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDetailCourse, deleteWeek, deleteCourse } from "@/lib/api/courses-api";
import WeekModal from "./WeekModal";
import { formatDeadline } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import CreateEditCourseModal from "./CreateEditCourseModal";
import AddAssignmentOrMaterialModal from "./AddAssignmentOrMaterialModal";
import { fetchProfile } from "@/lib/api/auth-api";

export default function DetailCourse() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lecturer, setLecturer] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const [showModalAddWeek, setShowModalAddWeek] = useState(false);
  const [showEditWeekModal, setShowEditWeekModal] = useState(false);
  const [selectedWeekData, setSelectedWeekData] = useState(null);
  const [showModalWeekContent, setShowModalWeekContent] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState(null);

  const [showEditCourseModal, setShowEditCourseModal] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(256);

  const isOwner = user?.id === course?.lecturer_id;

  // Trigger fade-in animation
  useEffect(() => {
    if (!loading && course) {
      setTimeout(() => setFadeIn(true), 50);
    }
  }, [loading, course]);

  // Monitor sidebar width changes
  useEffect(() => {
    const detectSidebarWidth = () => {
      const sidebar = document.querySelector('.from-blue-600');
      if (sidebar) {
        const width = sidebar.offsetWidth;
        setSidebarWidth(width);
      }
    };

    detectSidebarWidth();

    const sidebar = document.querySelector('.from-blue-600');
    if (sidebar) {
      const observer = new MutationObserver(detectSidebarWidth);
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      const interval = setInterval(detectSidebarWidth, 100);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setFadeIn(false);
      const { data: courseData } = await fetchDetailCourse(id);
      setCourse(courseData);
      setWeeks(courseData.weeks || []);

      if (courseData?.lecturer_id) {
        const { data: lecturerData } = await fetchProfile(courseData.lecturer_id);
        setLecturer(lecturerData);
      }
    } catch (err) {
      console.error("Failed to load course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWeek = (week) => {
    setSelectedWeekData(week);
    setShowEditWeekModal(true);
  };

  const handleAddContent = (weekId) => {
    setSelectedWeekId(weekId);
    setShowModalWeekContent(true);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <p className="text-2xl font-semibold text-blue-600 animate-pulse">
          Memuat detail course...
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <p className="text-red-600 font-medium">
          Data course tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 w-full transition-all duration-500 ease-out ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HEADER CARD */}
          <Card
            className={`p-6 sm:p-10 shadow-lg rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
              }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex justify-between items-start">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600">
                {course.title}
              </h1>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 text-gray-700 shadow-none hover:scale-110 transition-transform">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowEditCourseModal(true)}
                      className="flex hover:cursor-pointer hover:opacity-80 transition-all items-center gap-2"
                    >
                      <Pencil size={16} /> Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        if (!confirm(`Yakin ingin menghapus "${course.title}"?`)) return;

                        try {
                          await deleteCourse(course.id);
                          toast.success("Course berhasil dihapus");
                          window.location.href = "/courses";
                        } catch (error) {
                          toast.error("Gagal menghapus course");
                        }
                      }}
                      className="flex hover:cursor-pointer hover:opacity-80 transition-all items-center gap-2 text-red-600"
                    >
                      <Trash size={16} /> Hapus Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-base sm:text-lg text-gray-600 mt-2">
              {course.description}
            </p>

            <p className="text-base sm:text-lg text-gray-600 mt-6 font-bold">
              Kode Course: <span className="font-bold text-gray-900">{course.code}</span>
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm">
              {/* Enrollment Key */}
              <div className="p-4 sm:p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <p className="text-xs text-blue-700 uppercase tracking-wider font-semibold">
                  Enrollment Key
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1">{course.enrollment_key}</p>
              </div>

              {/* Lecturer */}
              <div className="p-4 sm:p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                <p className="text-xs text-purple-700 uppercase tracking-wider font-semibold">
                  Dosen Pengajar
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-900 mt-1">
                  {lecturer?.name || "Nama dosen tidak ditemukan"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-3 sm:p-4 shadow-xl rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-lg transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            {isOwner && (
              <>
                <Button
                  className="w-full sm:w-auto py-3 px-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 mb-4"
                  onClick={() => setShowModalAddWeek(true)}
                >
                  Tambah Pekan
                </Button>

                {/* Modal Add/Edit Week */}
                <WeekModal
                  mode={showEditWeekModal ? "edit" : "add"}
                  courseId={course.id}
                  weekId={selectedWeekData?.id}
                  initialTitle={selectedWeekData?.title}
                  isOpen={showModalAddWeek || showEditWeekModal}
                  onClose={() => {
                    setShowModalAddWeek(false);
                    setShowEditWeekModal(false);
                    setSelectedWeekData(null);
                  }}
                  onSuccess={loadCourse}
                />
              </>
            )}

            <WeeksList
              course={course}
              weeks={weeks}
              isOwner={isOwner}
              reloadWeeks={loadCourse}
              onEditWeek={handleEditWeek}
              onAddContent={handleAddContent}
              fadeIn={fadeIn}
            />

            {/* Modal Add Content */}
            {selectedWeekId && (
              <AddAssignmentOrMaterialModal
                weekId={selectedWeekId}
                courseId={course.id}
                isOpen={showModalWeekContent}
                onClose={() => setShowModalWeekContent(false)}
                onSuccess={loadCourse}
              />
            )}

            {/* edit course modal */}
            <CreateEditCourseModal
              mode="edit"
              isOpen={showEditCourseModal}
              onClose={() => setShowEditCourseModal(false)}
              onSuccess={loadCourse}
              initialData={course}
              courseId={course.id}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

const WeeksList = ({ weeks, isOwner, course, reloadWeeks, onEditWeek, onAddContent, fadeIn }) => {
  const [openWeek, setOpenWeek] = useState(null);

  const toggleWeek = (weekId) => setOpenWeek(openWeek === weekId ? null : weekId);

  const handleDeleteWeek = async (title, weekId) => {
    if (!window.confirm(`Yakin ingin menghapus ${title}?`)) return;

    try {
      await deleteWeek(course.id, weekId);
      toast.success("Pekan berhasil dihapus");
      reloadWeeks();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus pekan");
    }
  };

  return (
    <div className="space-y-3 mt-5">
      {weeks.map((week, index) => {
        const isOpen = openWeek === week.id;

        return (
          <div
            key={week.id}
            className={`border rounded-xl overflow-hidden shadow-sm bg-white transition-all duration-500 hover:shadow-md ${fadeIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            style={{ transitionDelay: `${300 + index * 100}ms` }}
          >
            <div
              className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 ${isOpen ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              onClick={() => toggleWeek(week.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <h3 className="text-base font-semibold text-gray-800">
                  {week.title}
                </h3>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <Button
                      className="h-8 w-8 shadow-none text-blue-600 hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddContent(week.id);
                      }}
                      title="Tambah Materi / Assignment"
                    >
                      <Plus size={16} />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-8 w-8 text-gray-700 shadow-none hover:scale-110 transition-transform">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEditWeek(week)}
                          className="flex hover:cursor-pointer hover:opacity-80 transition-all items-center gap-2"
                        >
                          <Pencil size={16} /> Edit Pekan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteWeek(week.title, week.id)}
                          className="flex hover:cursor-pointer hover:opacity-80 transition-all items-center gap-2 text-red-600"
                        >
                          <Trash size={16} /> Hapus Pekan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </div>

            {isOpen && (
              <div className="p-4 sm:p-5 space-y-6 bg-white border-t animate-slideDown">
                {/* Materials */}
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                    <FileText className="mr-2" size={18} /> Materi
                  </h4>
                  {week.materials?.length === 0 && (
                    <p className="text-sm italic text-gray-500">Belum ada materi.</p>
                  )}
                  <div className="space-y-3">
                    {week.materials?.map((mat, idx) => (
                      <a
                        href={`/courses/${course.id}/${week.id}/material/${mat.id}`}
                        key={mat.id}
                        className={`p-4 block border rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-fadeInUp`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <h5 className="font-semibold text-gray-800">{mat.title}</h5>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-6">{mat.content}</p>
                        {mat.files?.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {mat.files.map((file) => (
                              <a
                                key={file.id}
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm flex items-center gap-1 hover:text-blue-800 transition-colors"
                              >
                                <LinkIcon size={14} /> {file.file_name}
                              </a>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Assignments */}
                <div>
                  <h4 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
                    <BookOpen className="mr-2" size={18} /> Tugas
                  </h4>
                  {week.assignments?.length === 0 && (
                    <p className="text-sm italic text-gray-500">Belum ada tugas.</p>
                  )}
                  <div className="space-y-3">
                    {week.assignments?.map((asg, idx) => (
                      <a
                        href={`/courses/${course.id}/${week.id}/assignment/${asg.id}`}
                        key={asg.id}
                        className={`p-4 border rounded-xl shadow-sm block hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-fadeInUp`}
                        style={{ animationDelay: `${(week.materials?.length || 0) * 100 + idx * 100}ms` }}
                      >
                        <h5 className="font-semibold text-gray-800">{asg.title}</h5>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-6">{asg.description}</p>
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
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm flex items-center gap-1 hover:text-blue-800 transition-colors"
                              >
                                <LinkIcon size={14} /> {file.file_name}
                              </a>
                            ))}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};