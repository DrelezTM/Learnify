import { fetchProfile } from "@/lib/api";
import { Download, FileText, Calendar, User, AlarmClock } from "lucide-react";
import { useEffect, useState } from "react";

export default function DetailMaterialAssignment({ data, type }) {
    if (!data) return <div className="p-8">Loading...</div>;

    const [author, setAuthor] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: user } = await fetchProfile(data.author_id);
                setAuthor(user.name);
            } catch (error) {
                console.error("Failed load author:", error);
            }
        };

        if (data.author_id) loadData();
    }, [data.author_id]);

    const formattedDate = new Date(data.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedDeadline =
        type === "assignment"
            ? new Date(data.deadline).toLocaleString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : null;

    return (
        <div className="p-10 w-full mx-10 space-y-5">

            {/* Header */}
            <div className="bg-white shadow-md rounded-2xl p-8 border">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {type === "material" ? "Materi" : "Tugas"} - {data.title}
                </h1>

                <div className="flex items-center text-gray-600 gap-6 text-sm">
                    {author && (
                        <div className="flex items-center gap-2">
                            <User size={16} /> {author}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {formattedDate}
                    </div>

                    {/* Deadline khusus assignment */}
                    {type === "assignment" && (
                        <div className="flex items-center gap-2 text-red-600 font-medium">
                            <AlarmClock size={16} /> Deadline: {formattedDeadline}
                        </div>
                    )}
                </div>
            </div>

            {/* Content / Description */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {type === "material" ? data.content : data.description}
                </p>
            </div>

            {/* Files */}
            {data.files?.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        File Lampiran
                    </h2>

                    <div className="flex gap-5 flex-wrap">
                        {data.files.map((file) => {

                            return (
                                <a
                                    key={file.id}
                                    href={file.file_path}
                                    download
                                    className="flex items-center hover:cursor-pointer w-fit gap-x-5 bg-gray-50 border p-4 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-blue-600" />
                                        <span className="text-gray-800 underline">
                                            {file.file_name}
                                        </span>
                                    </div>

                                    <Download size={18} className="text-gray-600" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
