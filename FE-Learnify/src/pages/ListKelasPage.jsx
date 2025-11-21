import Dashboard from '../components/Dashboard'
import Sidebar from '../components/Sidebar'
import "../App.css"

function ListKelasPage() {

    return (
        <div className="flex h-screen">
            <Sidebar />
            <Dashboard />
        </div>
    )
}

export default ListKelasPage
