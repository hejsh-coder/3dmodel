import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Box, Search, Settings, Cpu, Beaker } from 'lucide-react';

const sampleModels = [
    { id: 'base-gear', name: '베이스 기어', category: '로봇 공학', parts: 1, thumbnail: '⚙️' },
    { id: 'gripper', name: '그리퍼', category: '로봇 공학', parts: 1, thumbnail: '🤖' },
    { id: 'engine-v8', name: 'V8 엔진', category: '기계 공학', parts: 45, thumbnail: '🏎️' },
    { id: 'robot-arm', name: '6축 로봇 팔', category: '로봇 공학', parts: 12, thumbnail: '🦾' },
];

export default function BrowsePage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const filteredModels = sampleModels.filter(model =>
        (selectedCategory === 'All Categories' || model.category === selectedCategory) &&
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(0,40,20,0.4)_0%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_100%)] text-white">
            {/* 네비게이션 */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-lg bg-[rgb(0,255,133)] flex items-center justify-center">
                        <Box className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold">SIMVEX</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/login')}>로그인</Button>
                </div>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="mb-4 text-4xl font-bold">
                        학습할 <span className="text-[rgb(0,255,133)]">모델</span>을 선택하세요
                    </h1>
                    <p className="text-[rgba(255,255,255,0.7)] text-lg">
                        다양한 공학 모델을 3D로 탐험하고 깊이 있게 학습하세요
                    </p>
                </div>

                {/* 검색 및 필터 */}
                <div className={`flex gap-4 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,255,255,0.45)]" />
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(0,255,133)] transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm focus:outline-none focus:border-[rgb(0,255,133)] transition-colors cursor-pointer min-w-[180px]"
                        >
                            <option>All Categories</option>
                            <option>로봇 공학</option>
                            <option>기계 공학</option>
                        </select>
                    </div>
                </div>

                {/* 모델 그리드 */}
                <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {filteredModels.map((model) => (
                        <div
                            key={model.id}
                            className="relative bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(0,255,133,0.4)] transition-all duration-300 group cursor-pointer"
                            onClick={() => navigate(`/study/assembly-18`)} // StudyPage로 연결
                        >
                            <div className="aspect-[4/3] bg-[rgba(0,0,0,0.5)] flex items-center justify-center border-b border-[rgba(255,255,255,0.08)] group-hover:bg-[rgba(0,0,0,0.7)] transition-colors text-4xl">
                                {model.thumbnail}
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="text-base font-semibold mb-1 group-hover:text-[rgb(0,255,133)] transition-colors">{model.name}</h3>
                                    <p className="text-xs text-[rgba(255,255,255,0.5)]">{model.category}</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[rgba(255,255,255,0.5)]">
                                    <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {model.parts} parts</span>
                                </div>
                                <button className="w-full bg-[rgb(0,255,133)] text-black font-semibold py-2 rounded-lg hover:bg-[rgb(0,230,120)] transition-colors text-sm flex items-center justify-center gap-2">
                                    👁 Open
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}