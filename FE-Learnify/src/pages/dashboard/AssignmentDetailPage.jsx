import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DetailMaterialAssignment from '@/components/DetailMaterialAssignment';
import { showAssignment } from '@/lib/api/courses-api';

function AssignmentDetailPage() {
    const { id, weekId, assignmentId } = useParams();

    const [assignment, setAssignment] = useState(null);
    const [authorId, setAuthorId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);

    const [sidebarWidth, setSidebarWidth] = useState(256);

    // Trigger fade-in animation
    useEffect(() => {
        if (!loading && assignment) {
            setTimeout(() => setFadeIn(true), 50);
        }
    }, [loading, assignment]);

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

    const loadData = async () => {
        try {
            setLoading(true);
            setFadeIn(false);

            const { data } = await showAssignment(id, weekId, assignmentId);
            setAssignment(data.materials);
            setAuthorId(data.author_id);
        } catch (error) {
            console.error("Failed load detail:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id, weekId, assignmentId]);

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
            ) : !assignment ? (
                <div
                    className="min-h-screen bg-gray-50 flex items-center justify-center transition-all duration-300"
                >
                    <p className="text-red-600 font-medium">
                        Data tugas tidak ditemukan.
                    </p>
                </div>
            ) : (
                <DetailMaterialAssignment
                    type="assignment"
                    courseId={id}
                    authorId={authorId}
                    data={assignment}
                    onReload={loadData}
                />
            )}
        </div>
    );
}

export default AssignmentDetailPage
