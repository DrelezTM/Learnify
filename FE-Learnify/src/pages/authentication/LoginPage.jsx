import { useState } from "react";
import { Mail, Lock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchLogin } from "@/lib/api/auth-api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await fetchLogin(email, password);

            if (data.data.token) {
                document.cookie = `token=${data.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
                setUser(data.data.user);
                navigate('/courses');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response.data.message);
            console.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-12 items-center justify-center relative overflow-hidden">

                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="relative w-96 h-96 flex items-center justify-center">

                        <div
                            className="absolute"
                            style={{
                                width: '280px',
                                height: '280px',
                                transform: 'rotateX(60deg) rotateZ(45deg)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 to-blue-400/40 backdrop-blur-sm rounded-3xl border-2 border-white/30"></div>
                        </div>

                        <div
                            className="relative bg-white rounded-2xl shadow-2xl p-6 w-64"
                            style={{ transform: 'perspective(600px) rotateY(-15deg)' }}
                        >
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-8 bg-gray-200 rounded-lg"></div>
                                <div className="h-8 bg-gray-200 rounded-lg"></div>
                                <div className="h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"></div>
                            </div>
                        </div>

                        <div
                            className="absolute -left-8 bottom-12"
                            style={{ transform: 'translateY(-20px)', animation: 'float 3s ease-in-out infinite' }}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                                <div className="w-8 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg mx-auto mt-1"></div>
                            </div>
                        </div>

                        <div
                            className="absolute -right-8 bottom-12"
                            style={{ transform: 'translateY(-20px)', animation: 'float 3s ease-in-out infinite 1.5s' }}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                                <div className="w-8 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg mx-auto mt-1"></div>
                            </div>
                        </div>

                        <div
                            className="absolute top-8 right-16 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
                            style={{ animation: 'float 2s ease-in-out infinite' }}
                        >
                            <Lock className="text-white" size={20} />
                        </div>

                        <div
                            className="absolute top-20 left-12 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
                            style={{ animation: 'float 2.5s ease-in-out infinite 0.5s' }}
                        >
                            <Mail className="text-white" size={20} />
                        </div>
                    </div>

                    <div className="text-center mt-8 relative z-20">
                        <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang di Learnify</h2>
                        <p className="text-blue-100 text-lg">Platform pembelajaran terbaik untuk masa depan Anda</p>
                    </div>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(-20px); }
                        50% { transform: translateY(-30px); }
                    }
                `}</style>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <BookOpen className="text-white" size={32} />
                        </div>
                    </div>

                    <form className="bg-white rounded-3xl shadow-xl p-8 md:p-10">

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
                            <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Belum punya akun?{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                        Daftar sekarang
                                    </a>
                                </p>
                            </div>

                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        © 2024 Learnify. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
