import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// --- Data Contoh untuk Absensi Hari Ini ---
const todayCourses = [
    {
        id: 1,
        matkul: "Pemrograman Lanjut",
        dosen: "Ir. John Doe, M.Kom.",
        jam: "08:00 - 09:40 WIB",
        lokasi: "Ruang Lab 301",
        jenisPertemuan: "Teori & Praktikum",
    },
    {
        id: 2,
        matkul: "Sistem Basis Data",
        dosen: "Dr. Siti Aminah, S.T., M.Sc.",
        jam: "10:00 - 11:40 WIB",
        lokasi: "Teori & Teori",
        jenisPertemuan: "Online via Zoom",
    },
];

// --- Fungsi Helper untuk Format Tanggal ---
const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('id-ID', options);
};

// --- Komponen Header (Tanggal Sistem) ---
const Header = ({ fadeIn }) => {
    return (
        <header className={`py-8 px-10 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-sm transition-all duration-700 ${
            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
            <h1 className="text-3xl font-bold text-gray-800">
                Absensi Kedatangan
            </h1>
            <p className="text-gray-600 mt-2">
                Hari Ini: <span className="font-medium text-gray-800">{getFormattedDate()}</span>
            </p>
        </header>
    );
};

// --- Komponen Tabel Absensi ---
const AttendanceTable = ({ fadeIn }) => {
    return (
        <div className="p-4 sm:p-8">
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 text-gray-700 transition-all duration-700 ${
                fadeIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}>
                Mata Kuliah Hari Ini ({todayCourses.length} Sesi)
            </h2>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        {todayCourses.map((course, index) => (
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

                                        <Button className="w-full py-6 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold !rounded-xl shadow-lg transition-all duration-200 text-base">
                                            HADIR
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

    // Trigger fade-in animation
    useEffect(() => {
        setTimeout(() => setFadeIn(true), 50);
    }, []);

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

    return (
        <div 
            className="flex-1 bg-gray-100 w-full transition-all duration-300 ease-in-out overflow-y-auto"
            style={{ 
                marginLeft: `${sidebarWidth}px`,
                height: '100vh'
            }}
        >
            <Header fadeIn={fadeIn} />
            <AttendanceTable fadeIn={fadeIn} />
        </div>
    );
}