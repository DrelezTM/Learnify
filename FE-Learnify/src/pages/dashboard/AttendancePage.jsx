import Attendance from '@/components/Attendance'
import Sidebar from '../../components/Sidebar'



function AttendancePage() {

    return (
        <div className="flex h-screen">
            <Sidebar />
            <Attendance />

        </div>
    )
}

export default AttendancePage
