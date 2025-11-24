import Sidebar from '@/components/Sidebar'
import Calenderview from '@/components/Schedule/Calenderview'
import Listview from '@/components/Schedule/List'

function SchedulePage() {

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <Calenderview />
            <Listview />

        </div>
    )
}

export default SchedulePage
