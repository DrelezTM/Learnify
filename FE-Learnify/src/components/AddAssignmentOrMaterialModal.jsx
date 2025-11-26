import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import { addAssignments, addMaterials } from "@/lib/api";

export default function AddAssignmentOrMaterialModal({ isOpen, onClose, courseId, weekId, onSuccess }) {
    const [type, setType] = useState("material"); // material / assignment

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // for assignment
    const [deadline, setDeadline] = useState(""); // for assignment

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDeadline("");
        setFiles([]);
        setType("material");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!weekId) return toast.error("Week ID tidak ditemukan");

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);

            if (type === "material") {
                if (files && files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        formData.append("files[]", files[i]);
                    }
                }
                formData.append("content", description || "");

                await addMaterials(courseId, weekId, formData);
                toast.success("Material berhasil ditambahkan!");
            } else if (type === "assignment") {
                formData.append("description", description || "");
                formData.append("deadline", deadline);

                const [datePart, timePart] = deadline.split("T"); 
                const formattedDeadline = `${datePart} ${timePart}:00`;
                formData.append("deadline", formattedDeadline);

                if (files && files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        formData.append("files[]", files[i]);
                    }
                }

                await addAssignments(courseId, weekId, formData);
                toast.success("Assignment berhasil ditambahkan!");
            }

            resetForm();
            onClose();
            onSuccess()
        } catch (err) {
            console.error(err);
            toast.error("Gagal menambahkan konten");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="relative z-50">
            <DialogContent className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
                <DialogTitle className="text-2xl font-bold mb-4">Tambah Konten</DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipe Konten</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2"
                        >
                            <option value="material">Materi</option>
                            <option value="assignment">Tugas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Judul</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-xl px-3 py-2"
                        />
                    </div>

                    {type === "assignment" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deadline</label>
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">File</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            className="w-full"
                        />
                    </div>


                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            type="button"
                            className="
                                px-4 py-2
                                rounded-xl
                                border border-gray-300
                                text-gray-700
                                hover:bg-gray-100
                                transition-all
                                font-medium
                            "
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading}
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
                            ">
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
