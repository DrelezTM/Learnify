import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseAxios } from "@/lib/baseAxios";
import { attendSession } from "@/lib/api";

const AttendanceTable = () => {

    const [todayCourses, setTodayCourses] = useState([]);

    // HELPER: Get User ID
    const getUserId = () => {
        const rawId = localStorage.getItem("user_id");
        if (rawId) return rawId;
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try { return JSON.parse(userStr).id || JSON.parse(userStr).user_id; } 
            catch (e) { return null; }
        }
        return null;
    };

    // Fungsi Fetch Data dipisah agar bisa dipanggil ulang (Re-fetch)
    const fetchCourses = () => {
        // Kita kirim user_id via query param jaga-jaga jika auth token bermasalah
        const uid = getUserId();
        
        baseAxios.get(`/attendance/today?user_id=${uid}`)
            .then(res => {
                setTodayCourses(
                    res.data.data.map(session => ({
                        id: session.id,
                        session_id: session.id,
                        matkul: session.course.title,
                        dosen: session.course.lecturer.name,
                        jam: `${session.start_time.slice(11, 16)} - ${session.end_time.slice(11, 16)}`,
                        lokasi: session.location ?? "-",
                        jenisPertemuan: session.mode ?? "-",
                        
                        // INI YANG PENTING: Baca status dari Laravel
                        is_attended: session.is_attended 
                    }))
                );
            })
            .catch(err => console.error(err));
    };

    // Fetch data saat halaman pertama kali dibuka
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fungsi submit presensi
    const handleAttend = async (sessionId) => {
        const currentUserId = getUserId();

        if (!currentUserId) {
            alert("Gagal: User ID tidak ditemukan. Silakan Login ulang.");
            return;
        }

        try {
            await attendSession(sessionId, currentUserId);
            alert("Presensi berhasil!");
            
            // UPDATE OTOMATIS: Panggil data terbaru dari server agar tombol berubah
            fetchCourses(); 

        } catch (err) {
            console.error("Attendance Error:", err);
            
            // Handle jika backend bilang "sudah absen"
            const msg = err.response?.data?.message || "Gagal melakukan presensi";
            
            if (msg.includes("sudah melakukan presensi")) {
                alert("Info: Anda sudah absen sebelumnya.");
                fetchCourses(); // Refresh tombol
            } else {
                alert(`Gagal: ${msg}`);
            }
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Mata Kuliah Hari Ini ({todayCourses.length} Sesi)
            </h2>

            <div className="border rounded-lg overflow-hidden bg-white shadow-md">
                <Table>

                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[280px]">Mata Kuliah & Dosen Pengajar</TableHead>
                            <TableHead className="w-[180px]">Jadwal</TableHead>
                            <TableHead className="w-[180px]">Lokasi & Jenis Pertemuan</TableHead>
                            <TableHead className="w-[300px] text-center">Presensi</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {todayCourses.map(course => (
                            <TableRow key={course.id}>

                                <TableCell className="font-medium">
                                    <p className="text-base font-semibold text-gray-800">{course.matkul}</p>
                                    <p className="text-sm text-gray-500">Dosen: {course.dosen}</p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-gray-700 font-medium">{course.jam}</p>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm text-gray-700">{course.lokasi}</p>
                                    <p className="text-xs text-gray-500">{course.jenisPertemuan}</p>
                                </TableCell>

                                <TableCell className="text-center">
                                    {/* LOGIKA TAMPILAN TOMBOL */}
                                    {course.is_attended ? (
                                        // OPSI 1: Tombol Disabled
                                        <Button
                                            disabled
                                            className="w-fit py-5 px-6 bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed border border-gray-200"
                                        >
                                            SUDAH HADIR
                                        </Button>

                                        // OPSI 2: Jika ingin tombol HILANG TOTAL, hapus kode Button di atas dan biarkan kosong:
                                        // null 
                                    ) : (
                                        <Button
                                            onClick={() => handleAttend(course.session_id)}
                                            className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                                        >
                                            HADIR
                                        </Button>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AttendanceTable;