import React, { useState, useEffect } from "react";
import { addWeek, editWeek } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "./ui/dialog";
import { toast } from "react-hot-toast";

export default function WeekModal({
    courseId,
    weekId = null,
    initialTitle = "",
    mode = "add",
    isOpen,
    onClose,
    onSuccess
}) {
    const [title, setTitle] = useState(initialTitle);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (mode === "add") {
                await addWeek(courseId, title);
                toast.success("Pekan berhasil ditambahkan");
            } else {
                await editWeek(courseId, title, weekId);
                toast.success("Pekan berhasil diedit");
            }

            onClose();
            onSuccess();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error("Terjadi kesalahan");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="relative z-50">
            <DialogContent className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
                <DialogTitle className="text-2xl font-bold mb-4">
                    {mode === "add" ? "Tambah Pekan" : "Edit Pekan"}
                </DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            className="w-full border-2 rounded-xl px-3 py-2 mt-1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title[0]}</p>
                        )}
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
                            {loading
                                ? (mode === "add" ? "Menambah..." : "Menyimpan...")
                                : (mode === "add" ? "Tambah" : "Simpan")}
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
