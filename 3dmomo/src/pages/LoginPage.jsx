import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { Input } from '../components/Input';
import { Box, Github } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/browse');
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center px-4 py-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[600px] h-[600px] -top-48 -left-48 bg-[radial-gradient(circle,rgba(0,255,133,0.15)_0%,transparent_70%)] animate-pulse" />
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-[rgb(0,255,133)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Box className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">SIMVEX</span>
                </button>
            </div>

            <div className="relative z-10 w-full max-w-[420px] mt-20">
                <GlassCard className="p-8">
                    <div className="text-center mb-7">
                        <h2 className="text-3xl font-bold mb-2 text-white">로그인</h2>
                        <p className="text-base text-[rgba(255,255,255,0.6)]">학습을 계속하려면 로그인하세요</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <Button variant="outline" className="w-full justify-center h-11 text-base">
                            <Github className="w-5 h-5" /> GitHub로 계속하기
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(255,255,255,0.1)]"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-[rgba(0,0,0,0.8)] text-[rgba(255,255,255,0.45)]">또는</span></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input type="email" label="이메일" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input type="password" label="비밀번호" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Button type="submit" variant="primary" className="w-full justify-center h-11 text-base font-semibold mt-2">로그인</Button>
                    </form>

                    <div className="mt-6 text-center text-base">
                        <span className="text-[rgba(255,255,255,0.6)]">계정이 없으신가요? </span>
                        <button onClick={() => navigate('/signup')} className="text-[rgb(0,255,133)] hover:text-[rgb(0,230,120)] font-semibold transition-colors">회원가입</button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}