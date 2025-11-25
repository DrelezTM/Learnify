import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baseAxios } from "@/lib/baseAxios";
import { attendSession } from "@/lib/api";

const AttendanceTable = () => {

    const [todayCourses, setTodayCourses] = useState([]);

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

    const fetchCourses = () => {
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

                        status: session.attendance_status, 
                        
                        start_time_full: session.start_time,
                        end_time_full: session.end_time
                    }))
                );
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAttend = async (sessionId) => {
        const currentUserId = getUserId();

        if (!currentUserId) {
            alert("Gagal: User ID tidak ditemukan. Silakan Login ulang.");
            return;
        }

        try {
            const res = await attendSession(sessionId, currentUserId);
            alert(res.message || "Presensi berhasil!");
            fetchCourses();

        } catch (err) {
            console.error("Attendance Error:", err);
            const msg = err.response?.data?.message || "Gagal melakukan presensi";
            alert(`Gagal: ${msg}`);
            fetchCourses(); 
        }
    };

    const renderStatus = (course) => {
        const now = new Date();
        const startTime = new Date(course.start_time_full);
        const endTime = new Date(course.end_time_full);

        if (course.status) {
            const statusStyles = {
                'present': 'bg-green-100 text-green-700 border-green-200',
                'late':    'bg-yellow-100 text-yellow-700 border-yellow-200',
                'absent':  'bg-red-100 text-red-700 border-red-200',
            };
            
            let label = course.status.toUpperCase();
            if(course.status === 'present') label = "HADIR";
            if(course.status === 'late') label = "TERLAMBAT";
            if(course.status === 'absent') label = "ALPA";

            const style = statusStyles[course.status] || 'bg-gray-100 text-gray-700';

            return (
                <div className={`w-fit py-5 px-6 font-semibold rounded-xl border ${style} flex items-center justify-center mx-auto`}>
                    {label}
                </div>
            );
        }

        if (now > endTime) {
            return (
                <Button
                    disabled
                    className="w-fit py-5 px-6 bg-red-100 text-red-500 border border-red-200 font-semibold rounded-xl cursor-not-allowed hover:bg-red-100"
                >
                    SESI BERAKHIR
                </Button>
            );
        }

        if (now < startTime) {
            return (
                <Button
                    disabled
                    className="w-fit py-5 px-6 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed border border-gray-300"
                >
                    BELUM MULAI
                </Button>
            );
        }

        return (
            <Button
                onClick={() => handleAttend(course.session_id)}
                className="w-fit py-5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
                HADIR
            </Button>
        );
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
                                    {renderStatus(course)}
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