import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "@/lib/api";
import { Button } from "./ui/button";

function CoursesList() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI states
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("name");
    const [showFilter, setShowFilter] = useState(false);
    const [minStudents, setMinStudents] = useState(0);

    useEffect(() => {
        async function loadData() {
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

        loadData();
    }, []);

    const filteredCourses = courses
        .filter(
            (course) =>
                course.title.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "name") return a.title.localeCompare(b.title);
            if (sortOrder === "students-asc") return a.students - b.students;
            if (sortOrder === "students-desc") return b.students - a.students;
            return 0;
        });

    if (loading)
        return <p className="p-10 text-center text-gray-500">Loading data...</p>;

    return (
        <>
            <div className="px-8 py-6 bg-gray-50 min-h-screen pb-20">
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

                    <Button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 h-full px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filter
                    </Button>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                        <option value="name">Nama (A-Z)</option>
                    </select>
                </div>

                {/* Filter area */}
                {showFilter && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">

                    </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Cari Course ({filteredCourses.length})
                </h2>

                {/* Kartu course */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col ">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {course.description}
                                </p>


                            </div>

                            <Button
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                            >
                                Lihat Detail
                            </Button>
                        </div>
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

export default CoursesList;
