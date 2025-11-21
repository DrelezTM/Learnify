import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { fetchClasses } from "../lib/api";

export default function Dashboard() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetchClasses()
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
            <main className="p-8">
                {loading && <p>Loading classes…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.length === 0 && <p>No classes found.</p>}
                        {classes.map((c) => (
                            <div key={c.id} className="p-4 bg-white rounded-lg shadow">
                                <h3 className="font-semibold text-lg">{c.name || c.semester || `Class #${c.id}`}</h3>
                                <p className="text-sm text-gray-600">{c.code || ''}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
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