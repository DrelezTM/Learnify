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
        <header className="py-10 px-12 bg-white border-b">
            <h1 className="text-3xl font-bold text-gray-800">Absensi Kedatangan</h1>
            {/* Menggunakan getFormattedDate() untuk menampilkan tanggal hari ini */}
            <p className="text-gray-500 mt-1">Hari Ini: **{getFormattedDate()}**</p>
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