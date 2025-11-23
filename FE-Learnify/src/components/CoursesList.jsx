import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { fetchCourses } from "../lib/api";

export default function CoursesList() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetchCourses()
            .then((data) => {
                if (mounted) setClasses(data);
            })
            .catch((err) => {
                console.error(err);
                if (mounted) setError(err.message || 'Failed to load');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false };
    }, []);

    return (
        <div className="flex-1 flex flex-col bg-gray-100">
            <Header />
        </div>
    );
}

const Header = () => {
    return (
        <header className="py-10 px-12 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">List Kelas</h1>
        </header>
    )
}
