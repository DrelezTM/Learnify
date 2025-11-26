import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCourses, fetchCoursesStudent } from "@/lib/api";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import JoinCourseModal from "./JoinCourseModal";
import CreateEditCourseModal from "./CreateEditCourseModal";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalJoin, setShowModalJoin] = useState(false);

  const [search, setSearch] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(256); 

  const { user } = useAuth();
  const navigate = useNavigate();

  const isLecturer = user?.role == "lecturer";

  function normalizeCourse(course, isLecturer) {
    if (isLecturer) {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        raw: course
      };
    } else {
      return {
        id: course.course.id,
        title: course.course.title,
        description: course.course.description,
        raw: course
      };
    }
  }

  // Smooth navigation function
  const smoothNavigate = (path) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  // Trigger fade-in animation
  useEffect(() => {
    if (!loading && courses) {
      setTimeout(() => setFadeIn(true), 50);
    }
  }, [loading, courses]);

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
    if (!user) return;
    async function loadMyCourse() {
      try {
        setFadeIn(false);
        const res = await fetchCoursesStudent();
        setCourses(res.data.map((course) => normalizeCourse(course, false)));
      } catch (error) {
        console.error("Failed load courses:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadAllDataCourse() {
      try {
        setFadeIn(false);
        const res = await fetchCourses();
        setCourses(res.data.map((course) => normalizeCourse(course, true)));
      } catch (error) {
        console.error("Failed load courses:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isLecturer) {
      loadAllDataCourse();
    } else {
      loadMyCourse();
    }
  }, [user]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const reloadCourses = async () => {
    setLoading(true);
    setFadeIn(false);

    try {
      if (isLecturer) {
        const res = await fetchCourses();
        setCourses(res.data.map((course) => normalizeCourse(course, true)));
      } else {
        const res = await fetchCoursesStudent();
        setCourses(res.data.map((course) => normalizeCourse(course, false)));
      }
    } catch (err) {
      console.error("Reload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div 
        className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 w-full"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading data...</p>
        </div>
      </div>
    );

  return (
    <div 
      className={`min-h-screen bg-gray-50 transition-all duration-500 ease-out w-full ${
        isTransitioning ? 'opacity-0 scale-95' : fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar & Actions */}
          <div 
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 transition-all duration-700 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {!isLecturer && (
              <Button
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300"
                onClick={() => setShowModalJoin(true)}
              >
                Join Course
              </Button>
            )}

            <JoinCourseModal
              isOpen={showModalJoin}
              onClose={() => setShowModalJoin(false)}
              onSuccess={reloadCourses}
            />
          </div>

          {/* Header Section */}
          <div 
            className={`mb-6 transition-all duration-700 ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                List Course ({filteredCourses.length})
              </h2>

              {isLecturer && (
                <Button
                  className="w-full sm:w-auto py-3 px-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 whitespace-nowrap"
                  onClick={() => setShowModalCreate(true)}
                >
                  Buat Course
                </Button>
              )}
            </div>

            {isLecturer && (
              <CreateEditCourseModal
                mode="create"
                isOpen={showModalCreate}
                onClose={() => setShowModalCreate(false)}
                onSuccess={reloadCourses}
              />
            )}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard 
                key={index} 
                course={course} 
                onNavigate={smoothNavigate}
                index={index}
                fadeIn={fadeIn}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div 
              className={`text-center py-12 transition-all duration-700 ${
                fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">Tidak ada course yang ditemukan</p>
              <p className="text-gray-400 text-sm mt-2">Coba gunakan kata kunci lain</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CourseCard = ({ course, onNavigate, index, fadeIn }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
        fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
    >
      <div className="flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 hover:text-blue-600 transition-colors duration-300">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-3 sm:mb-4">
          {course.description}
        </p>
      </div>

      <Button
        onClick={() => onNavigate(`/courses/${course.id}`)}
        className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm sm:text-base"
      >
        Lihat Detail
      </Button>
    </div>
  );
};