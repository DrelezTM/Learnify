import { useAuth } from "@/contexts/AuthContext";
import { deleteAssignment, deleteMaterial, submitAssignment } from "@/lib/api/courses-api";
import { Download, FileText, Calendar, User, AlarmClock, Trash, MoreHorizontal, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import { fetchProfile } from "@/lib/api/auth-api";

export default function DetailMaterialAssignment({ courseId, data, type, authorId, onReload }) {
    if (!data) return <div className="p-8">Loading...</div>;

    const [author, setAuthor] = useState("");
    const { user } = useAuth();

    const isOwner =
        Number(user?.id) === Number(data?.author_id) ||
        Number(user?.id) === Number(authorId);

        console.log(isOwner)

    const [files, setFiles] = useState([]);

    // for lecturer to see all submitters
    const [submitters, setSubmitters] = useState({});

    // fetch submitter name
    useEffect(() => {
        const loadSubmitterProfiles = async () => {
            if (!data?.assignment_submissions) return;

            const submissions = data.assignment_submissions;

            const results = await Promise.all(
                submissions.map(async (sub) => {
                    try {
                        const { data: userData } = await fetchProfile(sub.user_id);
                        return { userId: sub.user_id, name: userData.name };
                    } catch {
                        return { userId: sub.user_id, name: "Unknown User" };
                    }
                })
            );

            const profileMap = Object.fromEntries(
                results.map((r) => [r.userId, r.name])
            );

            setSubmitters(profileMap);
        };

        loadSubmitterProfiles();
    }, [data?.assignment_submissions]);


    const loadData = async () => {
        try {
            const { data: user } = await fetchProfile(data.author_id);
            setAuthor(user.name);
        } catch (error) {
            console.error("Failed load author:", error);
        }
    };

    const isStudent = user?.role == "student"

    // student has submitted?
    const hasSubmitted = data.assignment_submissions?.some(
        (s) => s.user_id === user?.id
    );

    useEffect(() => {
        if (data.author_id) loadData();
    }, [data.author_id, data]);

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


    const handleSubmission = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    formData.append("files[]", files[i]);
                }
            }
            await submitAssignment(courseId, data.week_id, data.id, formData);

            toast.success("Berhasil mengirim tugas!");
            setFiles([])
            onReload?.()
        } catch (err) {
            console.error(err);
            toast.error("Gagal mengirim tugas!");
        } finally {
        }
    };

    return (
        <div className="p-10 w-full mx-10 space-y-5">

            {/* Header */}
            <div className="bg-white shadow-md rounded-2xl p-8 border">
                <div className="flex justify-between">

                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {type === "material" ? "Materi" : "Tugas"} - {data.title}
                    </h1>

                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-8 w-8 text-gray-700 shadow-none">
                                    <MoreHorizontal size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={async () => {
                                        if (!confirm(`Yakin ingin menghapus "${data.title}"?`)) return;

                                        try {
                                            if (type == "material") {
                                                await deleteMaterial(courseId, data.week_id, data.id);
                                            } else {
                                                await deleteAssignment(courseId, data.week_id, data.id)
                                            }
                                            toast.success(`${type === "material" ? "Materi" : "Tugas"} berhasil dihapus`);
                                            window.location.href = `/courses/${courseId}`;
                                        } catch (error) {
                                            toast.error("Gagal menghapus!");
                                        }
                                    }}
                                    className="flex hover:cursor-pointer hover:opacity-80 transition-all  items-center gap-2 text-red-600"
                                >
                                    <Trash size={16} /> Hapus {type == "assignment" ? "Tugas" : "Materi"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    )}
                </div>

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
            <div className="bg-white p-8 rounded-2xl flex flex-col gap-5 shadow-sm border">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {type === "material" ? data.content : data.description}
                </p>

                {/* Files */}
                {data.files?.length > 0 && (
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
                )}
            </div>

            {/* if not submit yet */}
            {isStudent && !hasSubmitted && (
                <form
                    className="p-8 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 space-y-4"
                    onSubmit={handleSubmission}
                >
                    {/* Upload area */}
                    <label
                        htmlFor="submission"
                        className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition p-6 rounded-xl"
                    >
                        <Upload className="text-gray-500" size={32} />

                        <p className="text-gray-700 font-medium">
                            Klik untuk upload file
                        </p>

                        <p className="text-sm text-gray-500 uppercase">
                            jpg, jpeg, png, pdf, doc, docx, zip
                        </p>

                        <input
                            id="submission"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                                const selected = Array.from(e.target.files);
                                setFiles((prevFiles) => [...prevFiles, ...selected]);
                            }}
                        />
                    </label>

                    {/* File list */}
                    {files.length > 0 && (
                        <div className="bg-white border rounded-xl p-4">
                            <h3 className="text-sm font-semibold mb-2">File yang dipilih:</h3>

                            <ul className="space-y-2">
                                {files.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-xl"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{file.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>

                                        <button
                                            className="text-red-500 font-semibold text-sm hover:underline"
                                            onClick={() =>
                                                setFiles(files.filter((_, i) => i !== index))
                                            }
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Submit button */}
                    {files.length > 0 && (
                        <button
                            type="submit"
                            className="
                    w-full py-2
                    rounded-xl
                    bg-blue-600
                    text-white
                    font-medium
                    shadow-sm
                    hover:bg-blue-700
                    disabled:bg-blue-300
                    transition
                "
                        >
                            Submit Tugas
                        </button>
                    )}
                </form>
            )}

            {/* if already submitted for student */}
            {isStudent && hasSubmitted && (
                <div className="p-6 rounded-xl bg-green-50 border border-green-300">
                    <p className="text-green-700 font-semibold">
                        Kamu sudah mengumpulkan tugas ini 🎉
                    </p>

                    <div className="mt-4 space-y-2">
                        {data.assignment_submissions
                            .find((s) => s.user_id === user.id)
                            ?.submission_files?.map((file) => (
                                <a
                                    href={file.file_path}
                                    download
                                    key={file.id}
                                    className="flex justify-between items-center bg-white border p-3 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-blue-600" />
                                        <span className="text-gray-800 underline">
                                            {file.file_name}
                                        </span>
                                    </div>
                                    <Download size={18} />
                                </a>
                            ))}
                    </div>
                </div>
            )}

            {/* all assignments for lecturer to see */}
            {user?.role == "lecturer" && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Pengumpulan Tugas</h2>

                    {/* Tidak ada submission */}
                    {(!data.assignment_submissions || data.assignment_submissions.length === 0) && (
                        <p className="text-gray-600 italic">
                            Belum ada yang mengumpulkan tugas.
                        </p>
                    )}

                    {/* Daftar submission */}
                    {data.assignment_submissions?.length > 0 && (
                        <div className="space-y-4">
                            {data.assignment_submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="border p-4 rounded-xl bg-gray-50 space-y-2"
                                >
                                    <div className="flex justify-between">
                                        <div className="text-gray-800 font-medium">
                                            {submitters[sub.user_id] || "Loading..."}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Dikumpulkan pada : {new Date(sub.submitted_at).toLocaleString("id-ID", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>

                                    {/* File list */}
                                    <div className="space-y-2 mt-2">
                                        {sub.submission_files?.map((file, i) => (
                                            <a
                                                key={i}
                                                href={file.file_path}
                                                download
                                                className="flex items-center gap-3 px-4 py-3  bg-white border rounded-xl hover:bg-gray-100 transition"
                                            >
                                                <FileText size={18} className="text-blue-600" />
                                                <span className="underline text-gray-700">{file.file_name}</span>
                                                <Download size={16} className="text-gray-600 ml-auto" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
