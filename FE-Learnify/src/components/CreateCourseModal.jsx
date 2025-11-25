import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createCourse } from "@/lib/api";
import {
    Dialog,

    DialogContent,
    DialogTitle,
} from "./ui/dialog"
import { toast } from "react-hot-toast";

export default function CreateCourseModal({ isOpen, onClose, onSuccess }) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [major, setMajor] = useState("");
    const [studyProgram, setStudyProgram] = useState("");
    const [className, setClassName] = useState("");
    const [batch, setBatch] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await createCourse(title, description, major, studyProgram, className, batch)
            onClose()
            onSuccess()
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
                toast.error("Terjadi kesalahan saat membuat course");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="relative z-50">
            <DialogContent className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
                <DialogTitle className="text-2xl font-bold mb-4">Buat Course Baru</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Judul Course</label>
                        <input
                            type="text"
                            className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea
                            className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Major</label>
                            <input
                                type="text"
                                className="w-full border-2 rounded-xl px-3 py-2 mt-1"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                            />
                            {errors.major && <p className="text-red-500 text-sm">{errors.major[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Study Program</label>
                            <input
                                type="text"
                                className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                                value={studyProgram}
                                onChange={(e) => setStudyProgram(e.target.value)}
                            />
                            {errors.study_program && <p className="text-red-500 text-sm">{errors.study_program[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Class</label>
                            <input
                                type="text"
                                className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            {errors.class && <p className="text-red-500 text-sm">{errors.class[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Batch</label>
                            <input
                                type="text"
                                className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                            />
                            {errors.batch && <p className="text-red-500 text-sm">{errors.batch[0]}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
      px-4 py-2
      rounded-xl
      border border-gray-300
      text-gray-700
      hover:bg-gray-100
      transition-all
      font-medium
    "
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
      px-4 py-2
      rounded-xl
      bg-blue-600
      text-white
      font-medium
      shadow-sm
      hover:bg-blue-700
      disabled:bg-blue-300
      disabled:cursor-not-allowed
      transition-all
    "
                        >
                            {loading ? "Membuat..." : "Buat Course"}
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog >
    );
}
