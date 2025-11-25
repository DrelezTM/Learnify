import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCourses, fetchCoursesStudent } from "@/lib/api";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CreateCourseModal from "./CreateCourseModal";

export default function CoursesList() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModalCreate, setShowModalCreate] = useState(false);

    // UI states
    const [search, setSearch] = useState("");

    const { user } = useAuth()

    const isLecturer = user?.role == "lecturer"


    useEffect(() => {
        if (!user) return;
        async function loadMyCourse() {
            try {
                const res = await fetchCoursesStudent();
                setCourses(
                    res.data
                );

                console.log(res)
            } catch (error) {
                console.error("Failed load courses:", error);
            } finally {
                setLoading(false);
            }
        }

        async function loadAllDataCourse() {
            try {
                const res = await fetchCourses();
                setCourses(
                    res.data
                );

                console.log(res)
            } catch (error) {
                console.error("Failed load courses:", error);
            } finally {
                setLoading(false);
            }
        }

        if (isLecturer) {
            loadAllDataCourse();
        } else {
            loadMyCourse()
        }

    }, [user]);

    const filteredCourses = courses
        .filter(
            (course) =>
                course.title.toLowerCase().includes(search.toLowerCase())
        )

    const reloadCourses = async () => {
        setLoading(true)

        try {
            if (isLecturer) {
                const res = await fetchCourses()
                setCourses(res.data)
            } else {
                const res = await fetchCoursesStudent()
                setCourses(res.data)
            }
        } catch (err) {
            console.error("Reload failed:", err)
        } finally {
            setLoading(false)
        }
    }


    if (loading)
        return <p className="p-10 text-center text-gray-500">Loading data...</p>;

    return (
        <>
            <div className="px-8 py-6 w-full bg-gray-50 min-h-screen pb-20">
                {/* Search, Filter, Sort */}
                <div className="flex gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="flex items-center mb-6 justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        List Course ({filteredCourses.length})
                    </h2>

                    {isLecturer && (
                        <>
                            <Button
                                className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                                onClick={() => setShowModalCreate(true)}
                            >
                                Buat Course
                            </Button>

                            <CreateCourseModal
                                isOpen={showModalCreate}
                                onClose={() => setShowModalCreate(false)}
                                onSuccess={reloadCourses}
                            />
                        </>
                    )}

                </div>

                {/* Kartu course */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard course={course} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredCourses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada course yang ditemukan
                    </div>
                )}
            </div>
        </>
    );
}


const CourseCard = (course) => {
    const navigate = useNavigate();

    return (
        <div
            key={course.course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col ">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {course.course.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {course.course.description}
                </p>
            </div>

            <Button
                onClick={() => navigate(`/courses/${course.course.id}`)}
                className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
                Lihat Detail
            </Button>
        </div>
    )
}