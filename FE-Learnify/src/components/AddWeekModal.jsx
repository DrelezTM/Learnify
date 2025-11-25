import React, { useState } from "react";
import { addWeek } from "@/lib/api";
import {
    Dialog,

    DialogContent,
    DialogTitle,
} from "./ui/dialog"
import { toast } from "react-hot-toast";

export default function AddWeekModal({ courseId, isOpen, onClose, onSuccess }) {

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await addWeek(courseId, title)
            onClose()
            onSuccess()
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
                toast.error("Terjadi kesalahan saat menambahkan pekan!");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="relative z-50">
            <DialogContent className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
                <DialogTitle className="text-2xl font-bold mb-4">Tambah Pekan</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            className="w-full border-2 rounded-xl px-3 py-2 mt-1"

                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title[0]}</p>}
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
                            {loading ? "Menambah..." : "Tambah"}
                        </button>
                    </div>

                </form>
            </DialogContent>
        </Dialog >
    );
}
