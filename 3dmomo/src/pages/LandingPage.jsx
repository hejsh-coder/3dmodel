import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { Box, Settings, Cpu, Beaker, ArrowRight, Play, Eye, MessageSquare, BookOpen } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 마운트 시 애니메이션 트리거
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(0,40,20,0.4)_0%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_100%)] text-white font-sans">
            {/* 1. 배경 효과 (Glow Points & Decorations) */}
            <div className="absolute -left-40 top-1/4 w-[600px] h-[600px] bg-[rgb(0,255,133)] opacity-15 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute -right-40 top-2/3 w-[500px] h-[500px] bg-[rgb(0,255,133)] opacity-12 blur-[140px] rounded-full pointer-events-none" />

            <div className="absolute w-96 h-96 top-20 -right-48 opacity-30 rounded-full border border-[rgba(255,255,255,0.1)] pointer-events-none" />
            <div className="absolute w-64 h-64 bottom-40 -left-32 opacity-20 rounded-full border border-[rgba(255,255,255,0.1)] pointer-events-none" />
            <div className="absolute w-[600px] h-[600px] top-0 right-0 opacity-50 rounded-full bg-[radial-gradient(circle,rgba(0,255,133,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] bottom-0 left-0 opacity-40 rounded-full bg-[radial-gradient(circle,rgba(0,255,133,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* 2. 네비게이션 */}
            <nav
                className={`relative z-10 flex items-center justify-between px-8 py-6 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                }`}
            >
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-lg bg-[rgb(0,255,133)] flex items-center justify-center transition-transform group-hover:scale-105">
                        <Box className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
            <span className="text-[rgb(0,255,133)]">SIMVEX</span>
          </span>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8 text-sm hidden md:flex">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white hover:text-[rgb(0,255,133)] transition-colors font-medium"
                    >
                        HOME
                    </button>
                    <button
                        onClick={() => navigate('/browse')}
                        className="text-[rgba(255,255,255,0.7)] hover:text-[rgb(0,255,133)] transition-colors font-medium"
                    >
                        MODELS
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/login')}>
                        로그인
                    </Button>
                    <Button variant="primary" onClick={() => navigate('/signup')}>
                        시작하기
                    </Button>
                </div>
            </nav>

            {/* 3. 히어로 섹션 */}
            <section className="relative z-10 min-h-[calc(100vh-88px)] flex items-center justify-center px-8 -mt-12">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text Content */}
                        <div
                            className={`transition-all duration-1000 delay-200 ${
                                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'
                            }`}
                        >
                            <h1 className="text-7xl font-bold leading-[1.1] mb-8">
                                COMPLEX<br />
                                <span className="text-[rgb(0,255,133)]">TO SIMPLE</span><br />
                                FAST.
                            </h1>

                            <p className="text-xl text-[rgba(255,255,255,0.7)] mb-10 leading-relaxed">
                                복잡한 공학 구조를 3D로 보고, AI에게 묻고,<br/> 노트로 정리하세요.
                            </p>

                            <div className="flex items-center gap-5">
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => navigate('/signup')}
                                    icon={<Play className="w-5 h-5" />}
                                    className="text-lg px-8 py-6"
                                >
                                    Start Learning
                                </Button>
                                <Button
                                    variant="outline"
                                    size="md"
                                    onClick={() => navigate('/browse')}
                                    className="text-lg px-8 py-6"
                                >
                                    Explore Models
                                </Button>
                            </div>
                        </div>

                        {/* Right: 3D Preview Card */}
                        <div
                            className={`relative transition-all duration-1000 delay-400 ${
                                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'
                            }`}
                        >
                            <div className="absolute inset-0 bg-[rgb(0,255,133)] opacity-20 blur-[120px] rounded-full" />
                            <GlassCard className="relative overflow-hidden" glow>
                                <div className="aspect-[4/3] bg-[rgb(10,15,13)] rounded-lg flex items-center justify-center border border-[rgba(0,255,133,0.3)]">
                                    <div className="text-center">
                                        <Box className="w-24 h-24 mx-auto mb-4 text-[rgb(0,255,133)] animate-spin" style={{ animationDuration: '8s' }} />
                                        <p className="text-[rgba(255,255,255,0.5)] text-lg">3D Viewer Preview</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. 워크플로우 섹션 (Control) */}
            <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
                <div
                    className={`text-center mb-12 transition-all duration-1000 delay-400 ${
                        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
                    }`}
                >
                    <h2 className="mb-3 text-4xl font-bold">
                        A workflow that keeps you in <span className="text-[rgb(0,255,133)]">control.</span>
                    </h2>
                    <p className="text-[rgba(255,255,255,0.6)] text-lg">
                        학습 흐름을 제어하는 3가지 핵심 기능
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 3D Card */}
                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 hover:border-[rgba(0,255,133,0.3)] transition-all duration-300 h-full group">
                            <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,133,0.15)] border border-[rgba(0,255,133,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Eye className="w-7 h-7 text-[rgb(0,255,133)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">3D</h3>
                            <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed">
                                회전, 줌, 분해 기능으로 부품과 조립품 구조를 직관적으로 탐색하고 이해합니다.
                            </p>
                        </div>
                    </div>

                    {/* AI Card */}
                    <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 hover:border-[rgba(0,255,133,0.3)] transition-all duration-300 h-full group">
                            <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,133,0.15)] border border-[rgba(0,255,133,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7 text-[rgb(0,255,133)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">AI</h3>
                            <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed">
                                궁금한 구조에 대해 즉시 질문하고 맞춤형 설명을 받습니다.
                            </p>
                        </div>
                    </div>

                    {/* Notes Card */}
                    <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-8 hover:border-[rgba(0,255,133,0.3)] transition-all duration-300 h-full group">
                            <div className="w-14 h-14 rounded-xl bg-[rgba(0,255,133,0.15)] border border-[rgba(0,255,133,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-[rgb(0,255,133)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Notes</h3>
                            <p className="text-[rgba(255,255,255,0.6)] text-base leading-relaxed">
                                학습 중 떠오른 아이디어와 핵심 내용을 바로 기록하고 저장합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. How It Works 섹션 */}
            <section className="relative z-10 max-w-6xl mx-auto px-8 py-16">
                <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="mb-4 text-3xl font-bold">
                        Pick <ArrowRight className="inline-block w-6 h-6 mx-3 text-[rgba(255,255,255,0.5)]" />
                        <span className="text-[rgb(0,255,133)]">Explore</span>
                        <ArrowRight className="inline-block w-6 h-6 mx-3 text-[rgba(255,255,255,0.5)]" />
                        Ask & Note
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                    {/* Step 1 */}
                    <div className={`text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full border-2 border-[rgba(0,255,133,0.4)] bg-[rgba(0,255,133,0.05)] flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full bg-[rgba(0,255,133,0.15)] blur-xl"></div>
                                <span className="relative text-[rgb(0,255,133)] text-3xl font-bold">1</span>
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold">모델 선택</h3>
                        <p className="text-[rgba(255,255,255,0.7)] text-sm">학습하고 싶은 3D 모델을<br />선택하세요</p>
                    </div>

                    {/* 화살표 (PC only) */}
                    <div className="hidden md:flex items-center justify-center absolute left-[28%] top-10">
                        <ArrowRight className="w-6 h-6 text-[rgba(0,255,133,0.3)]" />
                    </div>

                    {/* Step 2 */}
                    <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full border-2 border-[rgba(0,255,133,0.6)] bg-[rgba(0,255,133,0.08)] flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full bg-[rgba(0,255,133,0.2)] blur-xl"></div>
                                <span className="relative text-[rgb(0,255,133)] text-3xl font-bold">2</span>
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold">3D 탐색</h3>
                        <p className="text-[rgba(255,255,255,0.7)] text-sm">구조를 회전하고 분해하며<br />관찰하세요</p>
                    </div>

                    <div className="hidden md:flex items-center justify-center absolute left-[61%] top-10">
                        <ArrowRight className="w-6 h-6 text-[rgba(0,255,133,0.3)]" />
                    </div>

                    {/* Step 3 */}
                    <div className={`text-center transition-all duration-1000 delay-[800ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full border-2 border-[rgba(0,255,133,0.8)] bg-[rgba(0,255,133,0.1)] flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full bg-[rgba(0,255,133,0.25)] blur-xl"></div>
                                <span className="relative text-[rgb(0,255,133)] text-3xl font-bold">3</span>
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-semibold">AI 질문 & 노트</h3>
                        <p className="text-[rgba(255,255,255,0.7)] text-sm">궁금한 점을 질문하고 학습<br />내용을 기록하세요</p>
                    </div>
                </div>
            </section>

            {/* 6. 카테고리 섹션 */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 py-16">
                <div className={`text-center mb-12 transition-all duration-1000 delay-[900ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="mb-3 text-3xl font-bold">
                        이런 분야를 <span className="text-[rgb(0,255,133)]">공부하시나요?</span>
                    </h2>
                    <p className="text-[rgba(255,255,255,0.7)] text-base">
                        다양한 공학 분야의 모델을 제공합니다
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[{ title: '기계공학', desc: '엔진, 서스펜션 등', icon: Settings },
                        { title: '로봇공학', desc: '로봇 팔, 그리퍼 등', icon: Cpu },
                        { title: '의공학', desc: '의료 기기, 시스템 등', icon: Beaker }].map((item, i) => (
                        <div
                            key={i}
                            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${1000 + i * 100}ms` }}
                        >
                            <GlassCard hover className="text-center h-full group">
                                <div className="w-16 h-16 mx-auto rounded-xl bg-[rgba(0,255,133,0.15)] border border-[rgba(0,255,133,0.3)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-[rgb(0,255,133)]" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                                <p className="text-[rgba(255,255,255,0.7)] text-sm">{item.desc}</p>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. 최종 CTA 섹션 */}
            <section className="relative z-10 max-w-5xl mx-auto px-8 py-16">
                <div className={`transition-all duration-1000 delay-[1300ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <GlassCard className="text-center py-12" glow>
                        <h2 className="mb-3 text-3xl font-bold">
                            <span className="text-[rgb(0,255,133)]">3D 학습</span>의 미래를 경험하세요
                        </h2>
                        <p className="text-[rgba(255,255,255,0.7)] text-base mb-8 max-w-xl mx-auto">
                            지금 바로 시작하고 복잡한 공학 개념을 직관적으로 이해해보세요
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate('/signup')}
                            icon={<Play className="w-4 h-4" />}
                        >
                            시작하기
                        </Button>
                    </GlassCard>
                </div>
            </section>

            {/* 8. 푸터 */}
            <footer
                className={`relative z-10 border-t border-[rgba(255,255,255,0.1)] py-8 transition-all duration-1000 delay-[1400ms] ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[rgba(255,255,255,0.45)] text-sm">
                        © 2026 SIMVEX. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-[rgba(255,255,255,0.45)]">
                        {['이용약관', '개인정보처리방침', '문의하기'].map(text => (
                            <a key={text} href="#" className="hover:text-[rgb(0,255,133)] transition-colors">{text}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}