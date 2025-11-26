import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showMaterial } from '@/lib/api/courses-api';
import DetailMaterialAssignment from '@/components/DetailMaterialAssignment';

function MaterialDetailPage() {
    const { id, weekId, materialId } = useParams();
    const [material, setMaterial] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await showMaterial(id, weekId, materialId);
                console.log(data)
                setMaterial(data)
            } catch (error) {
                console.error("Failed load detail:", error);
            }
        };

        loadData();
    }, [])

    return (
        <div className="flex h-screen ml-64">
            <Sidebar />
            <DetailMaterialAssignment type="material" courseId={id} data={material} />
        </div>
    )
}

export default MaterialDetailPage
