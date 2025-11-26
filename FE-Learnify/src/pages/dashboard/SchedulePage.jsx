import Sidebar from '@/components/Sidebar'
import Listview from '@/components/Schedule/List'

function SchedulePage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <Listview />
        </div>
    )
}

export default SchedulePage