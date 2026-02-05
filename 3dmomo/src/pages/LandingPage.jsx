import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    // 카드 데이터: Comatis 스타일의 3D 아이콘 느낌과 네온 컬러 적용
    const cards = [
        { title: "Mechanical Eng", desc: "Simulation & Assembly", icon: "fa-gears", color: "text-blue-400", bg: "bg-blue-500/10", glow: "shadow-blue-500/50" },
        { title: "Bio-Technology", desc: "Molecular Structures", icon: "fa-dna", color: "text-purple-400", bg: "bg-purple-500/10", glow: "shadow-purple-500/50" },
        { title: "Cloud Computing", desc: "Server Architecture", icon: "fa-cloud", color: "text-gray-300", bg: "bg-white/10", glow: "shadow-white/50" },
        { title: "AI Development", desc: "Neural Networks", icon: "fa-brain", color: "text-blue-500", bg: "bg-blue-600/10", glow: "shadow-blue-600/50" },
        { title: "Architecture", desc: "Structural Dynamics", icon: "fa-city", color: "text-indigo-300", bg: "bg-indigo-400/10", glow: "shadow-indigo-400/50" },
        { title: "Electronics", desc: "Circuit Design", icon: "fa-microchip", color: "text-emerald-300", bg: "bg-emerald-400/10", glow: "shadow-emerald-400/50" },
        { title: "Data Analytics", desc: "Processing", icon: "fa-chart-pie", color: "text-yellow-400", bg: "bg-yellow-500/10", glow: "shadow-yellow-500/50" },
        { title: "Security", desc: "Encryption", icon: "fa-shield-halved", color: "text-indigo-400", bg: "bg-indigo-500/10", glow: "shadow-indigo-500/50" },
    ];

    return (
        <div className="min-h-screen w-full relative bg-deep-space text-white overflow-hidden font-sans selection:bg-accent-gold/30">

            {/* ✨ 배경 빛 번짐 효과 (Aurora Effect) */}
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-accent-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* 1. 네비게이션: 상단에 깔끔하게 배치 */}
            <nav className="w-full flex items-center justify-between px-6 md:px-10 py-8 relative z-50">
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">S</div>
                    <span className="text-xl font-bold tracking-wide group-hover:text-gray-200 transition-colors">SIMVEX</span>
                </div>

                {/* 데스크탑 메뉴 */}
                <div className="hidden md:flex gap-10 text-sm font-medium text-gray-300">
                    {['Home', 'About', 'Portfolio', 'Contact'].map((item) => (
                        <button key={item} className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all">
                            {item}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/learning')}
                    className="bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-sm active:scale-95"
                >
                    Get Started
                </button>
            </nav>

            {/* 메인 컨테이너 */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20 relative z-10">

                {/* 2. 히어로 섹션 (유리 패널 박스) */}
                <div className="glass-panel rounded-[3rem] p-10 md:p-20 mb-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[500px] transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]">

                    {/* 왼쪽 텍스트 */}
                    <div className="max-w-2xl z-10 relative">
                        <h1 className="text-6xl md:text-8xl font-medium leading-[1.1] mb-8 tracking-tight">
                            Innovate.<br/>
                            Elevate.<br/>
                            {/* 금색 그라데이션 텍스트 */}
                            <span className="text-gradient-gold font-bold drop-shadow-sm">Transform.</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed font-light">
                            Simvex provides realistic 3D engineering simulations. <br className="hidden md:block"/>
                            Break down complexity and visualize mechanisms in real-time.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/learning')}
                                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                Explore Solutions
                            </button>
                            <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all group">
                                <i className="fa-solid fa-arrow-down -rotate-45 text-white group-hover:rotate-0 transition-transform duration-300"></i>
                            </button>
                        </div>
                    </div>

                    {/* 오른쪽 3D 추상 오브젝트 (Comatis 스타일의 유리 큐브 연출) */}
                    <div className="hidden md:flex relative items-center justify-center">
                        <div className="relative w-80 h-80">
                            {/* 뒤쪽 글로우 */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-accent-gold/20 rounded-full blur-3xl animate-pulse"></div>

                            {/* 3D 아이콘 (큐브) */}
                            <i className="fa-solid fa-cube text-[300px] text-white/5 drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)] icon-3d transform rotate-12 hover:rotate-45 transition-transform duration-[3s] cursor-pointer backdrop-blur-sm"></i>

                            {/* 중앙 장식 아이콘 */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                                🧊
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 벤토 그리드 (Bento Grid) 섹션 - 유리 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {cards.map((card, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate('/learning')}
                            className="glass-panel p-8 rounded-[2rem] hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-64 hover:-translate-y-2 relative overflow-hidden"
                        >
                            {/* 배경에 살짝 비치는 빛 */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} blur-[40px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>

                            {/* 아이콘: 3D 느낌의 박스 안에 배치 */}
                            <div className={`w-16 h-16 rounded-2xl ${card.bg} border border-white/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 icon-3d shadow-inner`}>
                                <i className={`fa-solid ${card.icon} ${card.color} drop-shadow-md`}></i>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{card.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300">{card.desc}</p>
                            </div>

                            {/* 우측 상단 화살표 (호버 시 등장) */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                <i className="fa-solid fa-arrow-up-right text-white/50"></i>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}