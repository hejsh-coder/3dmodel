import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ title, desc, icon, level, path, isLocked, theme }) => {
    const navigate = useNavigate();

    // 테마별 색상 설정 (아이콘 배경 및 텍스트)
    const themeStyles = {
        cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "group-hover:border-cyan-500/50" },
        purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/50" },
        gold: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "group-hover:border-yellow-500/50" },
    };

    const style = themeStyles[theme] || themeStyles.cyan;

    return (
        <div
            onClick={() => !isLocked && navigate(path)}
            className={`
                glass-panel p-8 rounded-[2.5rem] flex flex-col h-full min-h-[320px] relative group cursor-pointer transition-all duration-500
                ${isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-2xl'}
                ${!isLocked && style.border}
            `}
        >
            {/* 상단: 아이콘 & 상태 뱃지 */}
            <div className="flex justify-between items-start mb-8">
                <div className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center text-3xl icon-3d group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`fa-solid ${icon} ${style.text}`}></i>
                </div>

                {/* 레벨 뱃지 (유리 알약 느낌) */}
                <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider uppercase text-gray-300 backdrop-blur-md">
                    {level}
                </span>
            </div>

            {/* 중단: 텍스트 */}
            <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
            </div>

            {/* 하단: 액션 버튼 */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className={`text-sm font-bold flex items-center gap-2 ${isLocked ? 'text-gray-500' : 'text-white group-hover:gap-3 transition-all'}`}>
                    {isLocked ? 'Coming Soon' : 'Start Simulation'}
                    {!isLocked && <i className="fa-solid fa-arrow-right text-xs"></i>}
                </span>
                {isLocked && <i className="fa-solid fa-lock text-gray-500"></i>}
            </div>

            {/* 호버 시 나타나는 은은한 배경 빛 */}
            {!isLocked && (
                <div className={`absolute inset-0 ${style.bg} opacity-0 group-hover:opacity-20 rounded-[2.5rem] transition-opacity duration-500 pointer-events-none blur-3xl`}></div>
            )}
        </div>
    );
};

export default function LearningPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full relative bg-deep-space text-white overflow-hidden font-sans">

            {/* 배경 빛 번짐 효과 (LandingPage와 위치를 살짝 다르게 하여 변화를 줌) */}
            <div className="absolute top-[-20%] right-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* 1. 네비게이션 */}
            <nav className="w-full flex items-center justify-between px-10 py-8 relative z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">S</div>
                    <span className="text-xl font-bold tracking-wide">SIMVEX</span>
                </div>

                {/* 대시보드 표시 */}
                <div className="glass-panel px-5 py-2 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">Student Dashboard</span>
                </div>
            </nav>

            {/* 2. 메인 컨텐츠 */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20 relative z-10 pt-4">

                {/* 타이틀 섹션 */}
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-medium mb-4">
                        Engineering <span className="text-gradient-gold font-bold">Labs.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-light">
                        Select a project to begin your simulation. <br/>
                        All environments are powered by real-time physics engine.
                    </p>
                </div>

                {/* 프로젝트 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* [1] 18-Part Assembly (Cyan Theme) */}
                    <ProjectCard
                        title="Precision Assembly"
                        desc="Master the assembly of complex gear mechanisms. Features 18 distinct parts with snap-fit physics."
                        icon="fa-gears"
                        level="Basic"
                        theme="cyan"
                        path="/study/assembly-18"
                    />

                    {/* [2] Jet Engine (Purple Theme) */}
                    <ProjectCard
                        title="Turbofan Engine"
                        desc="Analyze the airflow and combustion chambers of a high-bypass turbofan engine."
                        icon="fa-jet-fighter"
                        level="Advanced"
                        theme="purple"
                        path="/study/jet-engine"
                        isLocked={true}
                    />

                    {/* [3] Robot Arm (Gold Theme) */}
                    <ProjectCard
                        title="6-Axis Kinematics"
                        desc="Program and control an industrial robot arm using inverse kinematics and path planning."
                        icon="fa-robot"
                        level="Expert"
                        theme="gold"
                        path="/study/robot-arm"
                        isLocked={true}
                    />
                </div>
            </div>
        </div>
    );
}