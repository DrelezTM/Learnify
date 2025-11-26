import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DetailMaterialAssignment from '@/components/DetailMaterialAssignment';
import { showAssignment } from '@/lib/api';

function AssignmentDetailPage() {
    const { id, weekId, assignmentId } = useParams();

    const [assignment, setAssignment] = useState(null);
    const [authorId, setAuthorId] = useState(null);

    const loadData = async () => {
        try {
            const { data } = await showAssignment(id, weekId, assignmentId);
            setAssignment(data.materials);
            setAuthorId(data.author_id);
        } catch (error) {
            console.error("Failed load detail:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [id, weekId, assignmentId]);

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <DetailMaterialAssignment
                type="assignment"
                courseId={id}
                authorId={authorId}
                data={assignment}
                onReload={loadData}
            />
        </div>
    );
}

export default AssignmentDetailPage
