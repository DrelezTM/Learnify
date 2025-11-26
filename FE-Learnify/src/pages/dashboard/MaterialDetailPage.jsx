import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showMaterial } from '@/lib/api/courses-api';
import DetailMaterialAssignment from '@/components/DetailMaterialAssignment';

function MaterialDetailPage() {
    const { id, weekId, materialId } = useParams();
    const [material, setMaterial] = useState(null);

    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);

    const [sidebarWidth, setSidebarWidth] = useState(256);

    // Trigger fade-in animation
    useEffect(() => {
        if (!loading && material) {
            setTimeout(() => setFadeIn(true), 50);
        }
    }, [loading, material]);

    // Monitor sidebar width changes
    useEffect(() => {
        const detectSidebarWidth = () => {
            const sidebar = document.querySelector('.from-blue-600');
            if (sidebar) {
                const width = sidebar.offsetWidth;
                setSidebarWidth(width);
            }
        };

        detectSidebarWidth();

        const sidebar = document.querySelector('.from-blue-600');
        if (sidebar) {
            const observer = new MutationObserver(detectSidebarWidth);
            observer.observe(sidebar, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });

            const interval = setInterval(detectSidebarWidth, 100);

            return () => {
                observer.disconnect();
                clearInterval(interval);
            };
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setFadeIn(false);

                const { data } = await showMaterial(id, weekId, materialId);
                console.log(data)
                setMaterial(data)
            } catch (error) {
                console.error("Failed load detail:", error);
            } finally {
                setLoading(false)
            }
        };

        loadData();
    }, [])

    return (
        <div className="flex h-screen"
            style={{ marginLeft: `${sidebarWidth}px` }}
        >
            <Sidebar />
            {loading ? (
                <div
                    className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300 w-full"
                >
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading data...</p>
                    </div>
                </div>
            ) : !material ? (
                <div
                    className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <p className="text-red-600 font-medium">
                        Data materi tidak ditemukan.
                    </p>
                </div>
            ) : (
                <DetailMaterialAssignment type="material" courseId={id} data={material} />
            )}
        </div>
    )
}

export default MaterialDetailPage
