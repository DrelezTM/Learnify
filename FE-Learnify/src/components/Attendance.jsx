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
        jam: "08:00 - 09:40 WIB", // Durasi Jam
        lokasi: "Ruang Lab 301", // Lokasi
        jenisPertemuan: "Teori & Praktikum", // Jenis Pertemuan
    },
    {
        id: 2,
        matkul: "Sistem Basis Data",
        dosen: "Dr. Siti Aminah, S.T., M.Sc.",
        jam: "10:00 - 11:40 WIB", // Durasi Jam
        lokasi: "Teori & Teori", // Lokasi
        jenisPertemuan: "Online via Zoom", // Jenis Pertemuan
    },
];

// --- Fungsi Helper untuk Format Tanggal ---
const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('id-ID', options);
};

// --- Komponen Header (Tanggal Sistem) ---
const Header = () => {
    return (
        <header className="py-8 px-10 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">
                Absensi Kedatangan
            </h1>
            <p className="text-gray-600 mt-2 animate-slide-up">
                Hari Ini: <span className="font-medium text-gray-800">{getFormattedDate()}</span>
            </p>
            
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out 0.2s backwards;
                }
            `}</style>
        </header>
    );
};

// --- Komponen Tabel Absensi ---
const AttendanceTable = () => {
    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Mata Kuliah Hari Ini ({todayCourses.length} Sesi)</h2>

            <div className="border rounded-lg overflow-hidden bg-white shadow-md">
                <Table>
                    {/* Header Tabel */}
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            {/* Menampilkan Matkul dan Dosen */}
                            <TableHead className="w-[280px]">Mata Kuliah & Dosen Pengajar</TableHead>
                            {/* Menampilkan Durasi Jam dan Tanggal Mulai */}
                            <TableHead className="w-[180px]">Jadwal </TableHead>
                            {/* Menampilkan Lokasi dan Jenis Pertemuan */}
                            <TableHead className="w-[180px]">Lokasi & Jenis Pertemuan</TableHead>
                            {/* Menampilkan Input Presensi dan Tombol Hadir */}
                            <TableHead className="w-[300px] text-center">Presensi</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Isi Tabel */}
                    <TableBody>
                        {todayCourses.map((course) => (
                            <TableRow key={course.id}>
                                {/* Kolom Matkul & Dosen */}
                                <TableCell className="font-medium">
                                    <p className="text-base font-semibold text-gray-800">{course.matkul}</p>
                                    <p className="text-sm text-gray-500">Dosen: {course.dosen}</p>
                                </TableCell>

                                {/* Kolom Jadwal (Durasi Jam & Tanggal Mulai) */}
                                <TableCell>
                                    <p className="text-sm text-gray-700 font-medium">{course.jam}</p>
                                </TableCell>

                                {/* Kolom Lokasi & Jenis Pertemuan */}
                                <TableCell>
                                    <p className="text-sm text-gray-700">{course.lokasi}</p>
                                    <p className="text-xs text-gray-500">{course.jenisPertemuan}</p>
                                </TableCell>

                                {/* Kolom Presensi (Input & Tombol HADIR) */}
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center space-y-2">
                                        {/* Tombol HADIR */}
                                        <Button className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                                        >
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
    return (
        <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
            <Header />
            <AttendanceTable />
        </div>
    );
}