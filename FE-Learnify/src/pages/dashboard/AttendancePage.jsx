import Attendance from '@/components/Attendance'
import Sidebar from '../../components/Sidebar'



function AttendancePage() {

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <Attendance />

        </div>
    )
}

export default AttendancePage
