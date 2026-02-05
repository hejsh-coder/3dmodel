import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { Settings, Cpu, Beaker, Lock, ArrowRight } from 'lucide-react';

const ProjectCard = ({ title, desc, icon: Icon, level, path, isLocked }) => {
    const navigate = useNavigate();

    return (
        <GlassCard
            hover={!isLocked}
            onClick={() => !isLocked && navigate(path)}
            className={`h-full flex flex-col relative overflow-hidden group ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isLocked ? 'bg-white/5' : 'bg-[rgba(0,255,133,0.15)] border border-[rgba(0,255,133,0.3)]'}`}>
                    <Icon className={`w-7 h-7 ${isLocked ? 'text-gray-500' : 'text-[rgb(0,255,133)]'}`} />
                </div>
                {isLocked && <Lock className="text-gray-500 w-5 h-5" />}
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-white/60 mb-8 flex-1 leading-relaxed">{desc}</p>

            <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-auto">
                <span className="text-xs font-bold tracking-widest text-[rgb(0,255,133)] bg-[rgba(0,255,133,0.1)] px-3 py-1 rounded-full uppercase">
                    {level}
                </span>
                {!isLocked && (
                    <span className="flex items-center gap-2 text-sm font-bold text-[rgb(0,255,133)] group-hover:gap-3 transition-all">
                        START <ArrowRight className="w-4 h-4" />
                    </span>
                )}
            </div>
        </GlassCard>
    );
};

export default function LearningPage() {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(0,40,20,0.4)_0%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_100%)] text-white p-8">
            <div className="max-w-7xl mx-auto py-12">
                <h1 className="text-5xl font-bold mb-4">My <span className="text-[rgb(0,255,133)]">Projects</span></h1>
                <p className="text-white/60 mb-12 text-lg">진행 중인 엔지니어링 시뮬레이션 목록입니다.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ProjectCard
                        title="Precision Assembly"
                        desc="기어, 링크, 핀으로 구성된 정밀 기계 장치의 조립 공정을 실습합니다."
                        icon={Settings}
                        level="Basic"
                        path="/study/assembly-18"
                    />
                    <ProjectCard
                        title="Turbofan Jet Engine"
                        desc="고바이패스 터보팬 엔진의 압축기 및 연소실 구조를 분석합니다."
                        icon={Cpu}
                        level="Advanced"
                        path="/study/jet-engine"
                        isLocked={true}
                    />
                    <ProjectCard
                        title="6-Axis Robot Arm"
                        desc="산업용 로봇 팔의 관절 구동 원리와 키네마틱스를 학습합니다."
                        icon={Beaker}
                        level="Expert"
                        path="/study/robot-arm"
                        isLocked={true}
                    />
                </div>
            </div>
        </div>
    );
}