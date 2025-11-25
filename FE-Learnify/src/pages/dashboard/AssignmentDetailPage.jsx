import DetailMaterial from '@/components/DetailMaterialAssignment'
import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DetailMaterialAssignment from '@/components/DetailMaterialAssignment';
import { showAssignment } from '@/lib/api';

function AssignmentDetailPage() {
    const { id, weekId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await showAssignment(id, weekId, assignmentId);
                setAssignment(data)
            } catch (error) {
                console.error("Failed load detail:", error);
            }
        };

        loadData();
    }, [])

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <DetailMaterialAssignment type="assignment" data={assignment} />
        </div>
    )
}

export default AssignmentDetailPage
