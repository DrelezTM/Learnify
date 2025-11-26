import { useState, useEffect } from "react";
import { fetchTodaySessions, submitAttendance } from "@/lib/api/attendance-api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

// --- Komponen Header (Tanggal Sistem) ---
const Header = ({ fadeIn, dateString }) => {
    return (
        <header className={`py-8 px-10 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-sm transition-all duration-700 ${
            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
            <h1 className="text-3xl font-bold text-gray-800">
                Absensi Kedatangan
            </h1>
            <p className="text-gray-600 mt-2">
                Hari Ini: <span className="font-medium text-gray-800">{dateString || "Memuat..."}</span>
            </p>
        </header>
    );
};

// --- Komponen Tabel Absensi ---
const AttendanceTable = ({ fadeIn, sessions, isLoading, onAttend, isSubmitting }) => {
    
    if (isLoading) {
        return <div className="p-10 text-center text-gray-500">Sedang memuat jadwal...</div>;
    }

    if (sessions.length === 0) {
        return (
            <div className={`p-10 text-center text-gray-500 transition-all duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                Tidak ada jadwal kuliah hari ini.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 text-gray-700 transition-all duration-700 ${
                fadeIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}>
                Mata Kuliah Hari Ini ({sessions.length} Sesi)
            </h2>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        {sessions.map((course, index) => (
                            <TableRow key={course.id} className="border-0">
                                <TableCell className="p-0 pb-6">
                                    <div 
                                        className={`bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 space-y-4 hover:shadow-xl transition-all duration-500 overflow-hidden ${
                                            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                        style={{ transitionDelay: `${300 + index * 150}ms` }}
                                    >
                                        <div className="border-b pb-3">
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                {course.matkul}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Dosen: {course.dosen}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="bg-blue-50 rounded-xl p-3 hover:bg-blue-100 transition-all duration-300">
                                                <p className="text-xs text-blue-700 font-semibold uppercase mb-1">
                                                    Jadwal
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {course.jam}
                                                </p>
                                            </div>

                                            <div className="bg-purple-50 rounded-xl p-3 hover:bg-purple-100 transition-all duration-300">
                                                <p className="text-xs text-purple-700 font-semibold uppercase mb-1">
                                                    Lokasi
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {course.lokasi}
                                                </p>
                                            </div>

                                            <div className="bg-green-50 rounded-xl p-3 sm:col-span-2 hover:bg-green-100 transition-all duration-300">
                                                <p className="text-xs text-green-700 font-semibold uppercase mb-1">
                                                    Jenis Pertemuan
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {course.jenisPertemuan}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dynamic Button Logic */}
                                        <Button 
                                            onClick={() => onAttend(course.id)}
                                            disabled={course.has_attended || !course.can_attend || isSubmitting}
                                            className={`w-full py-6 px-6 font-semibold !rounded-xl shadow-lg transition-all duration-200 text-base ${
                                                course.has_attended 
                                                    ? "bg-green-600 hover:bg-green-700 text-white cursor-default"
                                                    : !course.can_attend 
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                            }`}
                                        >
                                            {course.has_attended 
                                                ? (course.status_text === 'LATE' ? "HADIR (TERLAMBAT)" : "SUDAH HADIR")
                                                : (!course.can_attend ? "BELUM DIBUKA / SELESAI" : (isSubmitting ? "MEMPROSES..." : "HADIR"))
                                            }
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

// --- Komponen Utama ---
export default function Attendance() {
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [fadeIn, setFadeIn] = useState(false);
    
    // Dynamic State
    const [sessions, setSessions] = useState([]);
    const [dateString, setDateString] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch Data
    const loadData = async () => {
        try {
            const data = await fetchTodaySessions();
            setSessions(data.sessions);
            setDateString(data.date);
        } catch (error) {
            console.error("Error loading attendance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Handle Attend
    const handleAttend = async (sessionId) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await submitAttendance(sessionId);
            // Refresh data to show "SUDAH HADIR" status
            await loadData();
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal absen";
        } finally {
            setIsSubmitting(false);
        }
    };

    // Trigger fade-in animation and fetch data
    useEffect(() => {
        setTimeout(() => setFadeIn(true), 50);
        loadData();
    }, []);

    // Monitor sidebar width changes (Original Logic)
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

    return (
        <div 
            className="flex-1 bg-gray-100 w-full transition-all duration-300 ease-in-out overflow-y-auto"
            style={{ 
                marginLeft: `${sidebarWidth}px`,
                height: '100vh'
            }}
        >
            <Header fadeIn={fadeIn} dateString={dateString} />
            <AttendanceTable 
                fadeIn={fadeIn} 
                sessions={sessions}
                isLoading={isLoading}
                onAttend={handleAttend}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}