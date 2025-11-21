import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react"; // Icon library

function LoginPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#2A3297] to-[#2A5ED6] p-4">
            <Card className="w-full max-w-md p-8 sm:p-10 bg-white/20 backdrop-blur-xl rounded-2xl 
                           shadow-xl border border-white/20 
                           relative overflow-hidden before:content-[''] before:absolute before:inset-0 
                           before:rounded-2xl before:border before:border-white/50 before:pointer-events-none">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Learnify</h1>
                    </div>

                    <h2 className="text-xl font-semibold text-white mt-6">Selamat Datang!</h2>
                    <p className="text-sm text-white/80">Silakan login untuk melanjutkan.</p>
                </div>

                {/* Form Login */}
                <form className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                        <Input
                            type="email"
                            placeholder="Email"
                            className="pl-10 rounded-lg bg-white/30 text-white placeholder:text-white placeholder-white/70 border-white/30 focus:border-white/50 focus:ring-white"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                        <Input
                            type="password"
                            placeholder="Kata Sandi"
                            className="pl-10 rounded-lg bg-white/30 text-white placeholder:text-white placeholder-white/70 border-white/30 focus:border-white/50 focus:ring-white"
                        />
                    </div>

                    <div className="flex flex-col gap-y-5">

                        <Button className="w-full bg-gradient-to-r hover:opacity-75 transition from-blue-500 to-indigo-600 shadow-md">
                            Masuk
                        </Button>

                        <p className="text-center text-xs text-white/70">Atau</p>

                        <Button
                            className="text-white"
                            variant={'outline'}
                        >
                            Buat Akun
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default LoginPage;
