import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Box, Search, ChevronDown, Check } from 'lucide-react';

// 샘플 데이터 (이미지가 없을 경우를 대비해 썸네일을 이모지로 대체했습니다)
const sampleModels = [
    {
        id: 'base-gear',
        name: '베이스 기어',
        fileName: 'BaseGear.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '초급',
        thumbnail: '⚙️'
    },
    {
        id: 'base-mounting-bracket',
        name: '베이스 마운팅 브래킷',
        fileName: 'BaseMountingbracket.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '초급',
        thumbnail: '🔩'
    },
    {
        id: 'base-plate',
        name: '베이스 플레이트',
        fileName: 'BasePlate.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '초급',
        thumbnail: '📐'
    },
    {
        id: 'gear-link-1',
        name: '기어 링크 1',
        fileName: 'Gearlink1.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '중급',
        thumbnail: '🔗'
    },
    {
        id: 'gripper',
        name: '그리퍼',
        fileName: 'Gripper.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '중급',
        thumbnail: '🤖'
    },
    {
        id: 'link',
        name: '링크',
        fileName: 'Link.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '중급',
        thumbnail: '🔧'
    },
    {
        id: 'pin',
        name: '핀',
        fileName: 'Pin.glb',
        category: '로봇 공학',
        parts: 1,
        difficulty: '초급',
        thumbnail: '📌'
    }
];

export default function BrowsePage() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredModels, setFilteredModels] = useState(sampleModels);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [favoritedModels, setFavoritedModels] = useState([]);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = sampleModels.filter(model =>
            (model.name.toLowerCase().includes(term.toLowerCase()) ||
                model.category.toLowerCase().includes(term.toLowerCase())) &&
            (selectedCategory === 'All Categories' || model.category === selectedCategory)
        );
        setFilteredModels(filtered);
    };

    const toggleFavorite = (modelId) => {
        setFavoritedModels(prev =>
            prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId]
        );
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(0,40,20,0.4)_0%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_100%)] text-white font-sans">

            {/* ✨ 1. 배경 조명 효과 (복구됨) */}
            <div className="absolute -left-40 top-1/4 w-[600px] h-[600px] bg-[rgb(0,255,133)] opacity-15 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute -right-40 top-2/3 w-[500px] h-[500px] bg-[rgb(0,255,133)] opacity-12 blur-[140px] rounded-full pointer-events-none" />

            {/* ✨ 2. 기하학적 장식 요소 (복구됨) */}
            <div className="absolute w-96 h-96 top-20 -right-48 opacity-30 rounded-full border border-[rgba(255,255,255,0.1)] pointer-events-none" />
            <div className="absolute w-64 h-64 bottom-40 -left-32 opacity-20 rounded-full border border-[rgba(255,255,255,0.1)] pointer-events-none" />

            {/* 🧭 3. 네비게이션바 (HOME / MODELS 링크 복구) */}
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

                {/* 중앙 링크 복구 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8 text-sm">
                    <button
                        onClick={() => navigate('/')}
                        className="text-[rgba(255,255,255,0.7)] hover:text-[rgb(0,255,133)] transition-colors font-medium"
                    >
                        HOME
                    </button>
                    <button
                        onClick={() => navigate('/browse')}
                        className="text-white hover:text-[rgb(0,255,133)] transition-colors font-medium font-bold border-b border-[rgb(0,255,133)] pb-0.5"
                    >
                        MODELS
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/login')}>
                        로그인
                    </Button>
                </div>
            </nav>

            {/* 메인 컨텐츠 */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                {/* 페이지 타이틀 */}
                <div
                    className={`mb-12 transition-all duration-1000 delay-200 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <h1 className="mb-4 text-4xl font-bold">
                        학습할 <span className="text-[rgb(0,255,133)]">모델</span>을 선택하세요
                    </h1>
                    <p className="text-[rgba(255,255,255,0.7)] text-lg">
                        다양한 공학 모델을 3D로 탐험하고 깊이 있게 학습하세요
                    </p>
                </div>

                {/* 검색 및 필터 */}
                <div
                    className={`flex gap-4 mb-8 transition-all duration-1000 delay-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,255,255,0.45)]" />
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-12 pr-4 py-3 bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm placeholder:text-[rgba(255,255,255,0.45)] focus:outline-none focus:border-[rgb(0,255,133)] transition-colors"
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
                            <option>전기 공학</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,255,255,0.5)] pointer-events-none" />
                    </div>
                </div>

                {/* 모델 그리드 */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 transition-all duration-1000 delay-400 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {filteredModels.map((model) => {
                        const isFavorited = favoritedModels.includes(model.id);

                        return (
                            <div
                                key={model.id}
                                className="relative bg-[rgba(15,15,15,0.8)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(0,255,133,0.4)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,255,133,0.15)]"
                                onClick={() => navigate(`/study/assembly-18`)} // ViewerPage 연결 (데모용 고정 경로)
                            >
                                {/* 즐겨찾기 버튼 */}
                                <button
                                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                                        isFavorited
                                            ? 'bg-[rgba(255,20,100,0.9)] text-[rgb(255,20,100)] scale-110'
                                            : 'bg-[rgba(0,0,0,0.5)] text-[rgba(255,255,255,0.6)] hover:text-[rgb(255,20,100)]'
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(model.id);
                                    }}
                                >
                                    <svg className="w-4 h-4" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                {/* 썸네일 영역 */}
                                <div className="aspect-[4/3] bg-[rgba(0,0,0,0.5)] flex items-center justify-center border-b border-[rgba(255,255,255,0.08)] group-hover:bg-[rgba(0,0,0,0.7)] transition-colors overflow-hidden">
                                    <span className="text-5xl drop-shadow-[0_0_15px_rgba(0,255,133,0.3)]">{model.thumbnail}</span>
                                </div>

                                {/* 정보 영역 */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-base font-semibold mb-1 text-white group-hover:text-[rgb(0,255,133)] transition-colors">
                                            {model.name}
                                        </h3>
                                        <p className="text-xs text-[rgba(255,255,255,0.5)]">
                                            {model.category}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-[rgba(255,255,255,0.5)]">
                    <span className="flex items-center gap-1">
                      <Box className="w-3 h-3" />
                        {model.parts} parts
                    </span>
                                        <span className="flex items-center gap-1">
                      ⚙️ {model.difficulty}
                    </span>
                                    </div>

                                    <button
                                        className="w-full bg-[rgb(0,255,133)] text-black font-bold py-2 rounded-lg hover:bg-[rgb(0,230,120)] transition-colors text-sm flex items-center justify-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                                    >
                                        Open Viewer
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 검색 결과 없음 */}
                {filteredModels.length === 0 && (
                    <div className="text-center py-20">
                        <Box className="w-16 h-16 mx-auto mb-4 text-[rgba(255,255,255,0.45)]" />
                        <h3 className="mb-2 text-[rgba(255,255,255,0.45)]">모델을 찾을 수 없습니다</h3>
                        <p className="text-[rgba(255,255,255,0.6)]">다른 검색어를 입력해보세요</p>
                    </div>
                )}
            </div>
        </div>
    );
}