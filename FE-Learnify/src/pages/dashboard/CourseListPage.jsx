import CourseList from '../../components/CoursesList'
import Sidebar from '../../components/Sidebar'


function CourseListPage() {

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <CourseList />
        </div>
    )
}

export default CourseListPage
