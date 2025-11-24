import { useState } from "react";
import { Mail, Lock, User, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Kamu harus login dulu untuk membuat akun!");
                setIsLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:8000/api/register",
                { name, email, password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.message || "Akun berhasil dibuat!");
            navigate("/login");

        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal membuat akun!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md p-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <BookOpen className="text-blue-600" size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Learnify</h1>
                    <h2 className="text-xl font-semibold text-white/95">Buat Akun Baru</h2>
                    <p className="text-sm text-white/70 mt-1">Isi data di bawah untuk mendaftar.</p>
                </div>

                <div className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama Lengkap"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/15 text-white placeholder:text-white/60 border border-white/20 focus:border-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/15 text-white placeholder:text-white/60 border border-white/20 focus:border-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Kata Sandi"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/15 text-white placeholder:text-white/60 border border-white/20 focus:border-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className={`w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 ${isLoading ? "opacity-80" : "opacity-100"}`}
                    >
                        Daftar
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-white/80 text-sm">
                            Sudah punya akun?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                className="text-blue-300 font-semibold cursor-pointer hover:underline"
                            >
                                Masuk
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
