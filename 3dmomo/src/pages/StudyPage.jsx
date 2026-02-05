import React, { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import {
    Box, ChevronLeft, ChevronRight, ChevronDown,
    RotateCw, ZoomIn, Bookmark, BookmarkCheck,
    Download, MessageSquare, FileText, RefreshCw,
    Send, Move, Rotate3D, Maximize, Eye, EyeOff, CheckCircle, Info
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 3D 관련 컴포넌트                                                            */
/* -------------------------------------------------------------------------- */

function CameraRig({ targetPosition }) {
    const { camera, controls } = useThree();
    useFrame((state, delta) => {
        if (!targetPosition) return;
        if (controls) {
            controls.target.lerp(targetPosition, 0.1);
            controls.update();
        }
        const desiredCameraPos = new THREE.Vector3(
            targetPosition.x + 0.5, targetPosition.y + 0.5, targetPosition.z + 0.5
        );
        state.camera.position.lerp(desiredCameraPos, 0.05);
    });
    return null;
}

function DraggablePart({ part, explosion, isSelected, onSelect, transformMode, onPartClick, isVisible }) {
    const { scene } = useGLTF(part.url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const meshRef = useRef();

    if (!isVisible) return null;

    const currentPosition = [
        part.defaultPos[0] + part.direction[0] * explosion,
        part.defaultPos[1] + part.direction[1] * explosion,
        part.defaultPos[2] + part.direction[2] * explosion
    ];

    return (
        <>
            {isSelected && (
                <TransformControls
                    object={meshRef}
                    mode={transformMode}
                    onMouseUp={() => { /* 좌표 로그 */ }}
                />
            )}
            <primitive
                ref={meshRef}
                object={clonedScene}
                position={currentPosition}
                rotation={part.rotation || [0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(part.id);
                    onPartClick(part.id);
                }}
            />
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* 메인 페이지                                                                 */
/* -------------------------------------------------------------------------- */

export default function StudyPage() {
    const navigate = useNavigate();

    // 상태 관리
    const [explosion, setExplosion] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [transformMode, setTransformMode] = useState("translate");
    const [focusTarget, setFocusTarget] = useState(null);
    const [checkedGroups, setCheckedGroups] = useState({});

    // UI 상태
    const [mainTab, setMainTab] = useState('ai');
    const [activeAiTab, setActiveAiTab] = useState('explain');
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [userNote, setUserNote] = useState('');

    // ✅ 부품 데이터 (Description 추가됨)
    const assemblyParts = useMemo(() => [
        { id: "base_gear", url: "/models/BaseGear.glb", defaultPos: [0.0076, 0.0178, -0.0027], direction: [0, -0.2, 0], rotation: [0.0000, -1.5706, 0.0000], description: "동력을 전달하는 메인 기어입니다. 고강도 강철로 제작되어 높은 토크를 견딜 수 있습니다." },
        { id: "mounting_bracket", url: "/models/BaseMountingbracket.glb", defaultPos: [0.0101, -0.0053, 0.0060], direction: [0, 0.2, 0], rotation: [-0.1133, 1.5241, 1.6775], description: "전체 구조물을 지지하고 고정하는 베이스 브래킷입니다." },
        { id: "base_plate", url: "/models/BasePlate.glb", defaultPos: [0, 0, 0], direction: [0, -0.2, 0], rotation: [0, 0, 0], description: "조립품의 기초가 되는 바닥 플레이트입니다. 진동을 흡수하는 역할을 합니다." },
        { id: "gear_link_1", url: "/models/Gearlink1.glb", defaultPos: [0.0136, 0.0378, 0.0048], direction: [0.2, 0.2, 0], rotation: [1.5754, -0.0569, -1.5434], description: "기어와 연결되어 회전 운동을 직선 운동으로 변환하는 첫 번째 링크입니다." },
        { id: "gear_link_2", url: "/models/Gearlink2.glb", defaultPos: [-0.0136, 0.0378, 0.0062], direction: [-0.2, 0.2, 0], rotation: [-3.1374, -0.0061, -1.7756], description: "반대쪽 기어와 연결되는 두 번째 링크입니다." },
        { id: "link_L", url: "/models/Link.glb", defaultPos: [-0.0064, 0.0740, 0.0048], direction: [-0.3, 0.1, 0], rotation: [-1.5713, -0.0883, -1.5496], description: "그리퍼를 작동시키는 왼쪽 링크 암입니다." },
        { id: "link_R", url: "/models/Link.glb", defaultPos: [0.0060, 0.0739, 0.0049], direction: [0.3, 0.1, 0], rotation: [-1.5634, 0.0671, -1.5615], description: "그리퍼를 작동시키는 오른쪽 링크 암입니다." },
        { id: "gripper_L", url: "/models/Gripper.glb", defaultPos: [-0.0031, 0.0870, 0.0000], direction: [-0.3, 0, 0.2], rotation: [-0.0002, 0.0284, 1.1878], description: "물체를 잡는 역할을 하는 왼쪽 그리퍼(집게)입니다." },
        { id: "gripper_R", url: "/models/Gripper.glb", defaultPos: [0.0027, 0.0870, 0.0012], direction: [0.3, 0, 0.2], rotation: [-3.1414, -0.0374, -1.9538], description: "물체를 잡는 역할을 하는 오른쪽 그리퍼(집게)입니다." },
        { id: "Pin_01", url: "/models/Pin.glb", defaultPos: [0.0052, 0.0585, 0.0024], direction: [0.2, 0.2, 0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        // ... (나머지 핀들은 동일한 설명 사용)
        { id: "Pin_02", url: "/models/Pin.glb", defaultPos: [-0.0075, 0.0895, 0.0024], direction: [-0.2, 0.2, 0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_03", url: "/models/Pin.glb", defaultPos: [0.0154, 0.0689, 0.0020], direction: [0.2, 0.2, -0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_04", url: "/models/Pin.glb", defaultPos: [-0.0154, 0.0689, 0.0020], direction: [-0.2, 0.2, -0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_05", url: "/models/Pin.glb", defaultPos: [0.0073, 0.0894, 0.0024], direction: [0.3, 0.1, 0], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_06", url: "/models/Pin.glb", defaultPos: [-0.0136, 0.0377, 0.0025], direction: [-0.3, 0.1, 0], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_07", url: "/models/Pin.glb", defaultPos: [0.0141, 0.0377, 0.0025], direction: [0, 0.1, 0.3], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_08", url: "/models/Pin.glb", defaultPos: [-0.0048, 0.0584, 0.0024], direction: [0, 0.1, -0.3], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_09", url: "/models/Pin.glb", defaultPos: [0.0053, 0.0034, 0.0022], direction: [0.1, 0, 0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
        { id: "Pin_10", url: "/models/Pin.glb", defaultPos: [-0.0053, 0.0034, 0.0022], direction: [-0.1, 0, 0.2], rotation: [3.1416, -1.5402, 3.1416], description: "부품 간의 회전축 역할을 하는 고정 핀입니다." },
    ], []);

    // 로직
    const groupedParts = useMemo(() => {
        const groups = {};
        assemblyParts.forEach(part => {
            if (!groups[part.url]) groups[part.url] = [];
            groups[part.url].push(part);
        });
        return groups;
    }, [assemblyParts]);

    const [visibleParts, setVisibleParts] = useState(
        Object.fromEntries(assemblyParts.map(p => [p.id, true]))
    );

    const toggleGroupVisibility = (url) => {
        const partsInGroup = groupedParts[url];
        const isFirstVisible = visibleParts[partsInGroup[0].id];
        const newStatus = !isFirstVisible;
        const newMap = { ...visibleParts };
        partsInGroup.forEach(p => newMap[p.id] = newStatus);
        setVisibleParts(newMap);
    };

    const toggleCheckbox = (url) => {
        setCheckedGroups(prev => ({ ...prev, [url]: !prev[url] }));
    };

    const getPartName = (url) => url.split('/').pop().replace('.glb', '');

    const handleDoubleClick = (url) => {
        const targetPart = groupedParts[url][0];
        if (targetPart) {
            const targetPos = new THREE.Vector3(
                targetPart.defaultPos[0] + targetPart.direction[0] * explosion,
                targetPart.defaultPos[1] + targetPart.direction[1] * explosion,
                targetPart.defaultPos[2] + targetPart.direction[2] * explosion
            );
            setFocusTarget(targetPos);
            setSelectedId(targetPart.id);
            setTimeout(() => setFocusTarget(null), 1000);
        }
    };

    // ✅ 선택된 부품 정보 가져오기
    const selectedPartInfo = useMemo(() =>
            assemblyParts.find(p => p.id === selectedId),
        [selectedId, assemblyParts]);

    const activeCheckedNames = Object.keys(checkedGroups)
        .filter(url => checkedGroups[url])
        .map(url => getPartName(url));

    const handleAiSubmit = (e) => {
        e.preventDefault();
        setAiInput('');
    };

    return (
        <div className="h-screen bg-black flex flex-col overflow-hidden font-sans text-white">

            {/* 1. Header */}
            <header className="flex-shrink-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/browse')}
                            className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-[rgb(0,255,133)] transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">돌아가기</span>
                        </button>
                        <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
                        <div className="flex items-center gap-2">
                            <Box className="w-5 h-5 text-[rgb(0,255,133)]" />
                            <div>
                                <h4 className="text-white font-semibold">Precision Assembly</h4>
                                <p className="text-xs text-[rgba(255,255,255,0.5)]">기계 공학</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`px-4 py-2 bg-transparent border rounded-lg transition-colors text-sm flex items-center gap-2 ${
                                isBookmarked
                                    ? 'border-[rgb(0,255,133)] text-[rgb(0,255,133)]'
                                    : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] hover:border-[rgb(0,255,133)] hover:text-[rgb(0,255,133)]'
                            }`}
                        >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            북마크
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] rounded-lg hover:border-[rgb(0,255,133)] hover:text-[rgb(0,255,133)] transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* 2. Left Sidebar */}
                <aside
                    className={`flex-shrink-0 border-r border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.8)] flex flex-col transition-all duration-300 z-40 overflow-hidden ${
                        leftPanelOpen ? 'w-72' : 'w-0'
                    }`}
                >
                    <div className="w-72 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white">부품 목록</h3>
                                <span className="text-xs text-[rgba(255,255,255,0.5)]">{Object.keys(groupedParts).length}개 그룹</span>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(groupedParts).map(([url, parts]) => {
                                    const partName = getPartName(url);
                                    const isGroupVisible = visibleParts[parts[0].id];
                                    const isChecked = !!checkedGroups[url];

                                    return (
                                        <div key={url} className="border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden bg-[rgba(255,255,255,0.02)]">
                                            <div
                                                className={`flex items-center px-4 py-3 hover:bg-[rgba(0,255,133,0.05)] transition-colors cursor-pointer ${selectedId === parts[0].id ? 'bg-[rgba(0,255,133,0.1)]' : ''}`}
                                                onClick={() => setSelectedId(parts[0].id)}
                                                onDoubleClick={() => handleDoubleClick(url)}
                                            >
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleCheckbox(url); }}
                                                    className="mr-3 flex-shrink-0"
                                                >
                                                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${
                                                        isChecked
                                                            ? 'bg-[rgb(0,255,133)] border-[rgb(0,255,133)]'
                                                            : 'border-[rgba(255,255,255,0.3)] hover:border-[rgb(0,255,133)]'
                                                    }`}>
                                                        {isChecked && <CheckCircle className="w-3 h-3 text-black" />}
                                                    </div>
                                                </button>

                                                <div className="flex-1 flex items-center justify-between text-left">
                                                    <span className={`text-sm ${selectedId === parts[0].id ? 'text-[rgb(0,255,133)] font-bold' : 'text-white'}`}>
                                                        {partName}
                                                    </span>
                                                    <button onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(url); }}>
                                                        {isGroupVisible
                                                            ? <Eye className="w-4 h-4 text-[rgba(255,255,255,0.5)] hover:text-white" />
                                                            : <EyeOff className="w-4 h-4 text-[rgba(255,255,255,0.3)] hover:text-white" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-shrink-0 p-5 border-t border-[rgba(255,255,255,0.08)]">
                            <button
                                onClick={() => navigate('/browse')}
                                className="w-full px-4 py-2 bg-[rgba(0,255,133,0.1)] border border-[rgba(0,255,133,0.3)] text-[rgb(0,255,133)] rounded-lg hover:bg-[rgba(0,255,133,0.15)] transition-colors text-sm"
                            >
                                모델 라이브러리
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Left Panel Toggle Button */}
                <button
                    onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                    className="absolute top-1/2 -translate-y-1/2 z-50 w-10 h-20 bg-[rgb(0,255,133)] hover:bg-[rgb(0,230,120)] rounded-r-lg flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,255,133,0.4)]"
                    style={{ left: leftPanelOpen ? '288px' : '0px' }}
                >
                    {leftPanelOpen ? <ChevronLeft className="w-5 h-5 text-black" /> : <ChevronRight className="w-5 h-5 text-black" />}
                </button>

                {/* 3. Center (3D Viewer) */}
                <main className="flex-1 flex flex-col relative min-w-0" style={{
                    background: 'radial-gradient(ellipse at 20% 50%, rgba(0,255,133,0.08) 0%, rgba(0,0,0,0) 50%), radial-gradient(ellipse at 80% 50%, rgba(0,100,255,0.06) 0%, rgba(0,0,0,0) 50%), black'
                }}>
                    {/* 상단 툴바 */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl">
                            <button onClick={() => setTransformMode('translate')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${transformMode === 'translate' ? 'bg-[rgb(0,255,133)] text-black' : 'text-white/60 hover:text-white'}`}>
                                <Move className="w-5 h-5" />
                            </button>
                            <button onClick={() => setTransformMode('rotate')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${transformMode === 'rotate' ? 'bg-[rgb(0,255,133)] text-black' : 'text-white/60 hover:text-white'}`}>
                                <Rotate3D className="w-5 h-5" />
                            </button>
                            <div className="w-[1px] h-6 bg-white/10 mx-2" />
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white"><Maximize className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <Canvas shadows camera={{ position: [0.8, 0.8, 0.8], fov: 35 }} className="bg-transparent">
                            <Suspense fallback={null}>
                                <CameraRig targetPosition={focusTarget} />
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} intensity={1.5} castShadow />
                                <Grid infiniteGrid cellSize={0.01} sectionSize={0.05} sectionColor="#00ff85" cellColor="#0a0f0d" fadeDistance={2} opacity={0.2} />
                                <group>
                                    {assemblyParts.map((part) => (
                                        <DraggablePart
                                            key={part.id}
                                            part={part}
                                            explosion={explosion}
                                            isSelected={selectedId === part.id}
                                            onSelect={setSelectedId}
                                            transformMode={transformMode}
                                            onPartClick={(id) => setSelectedId(id)}
                                            isVisible={visibleParts[part.id]}
                                        />
                                    ))}
                                </group>
                                <ContactShadows opacity={0.5} scale={10} blur={2} far={4} color="#00ff85" />
                                <Environment preset="city" />
                            </Suspense>
                            <OrbitControls makeDefault minDistance={0.1} maxDistance={3} />
                        </Canvas>
                    </div>

                    {/* 하단 슬라이더 */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.8)]">
                        <div className="mb-4 flex items-center gap-4">
                            <span className="text-xs font-medium text-[rgba(255,255,255,0.7)] whitespace-nowrap min-w-[80px]">
                                폭발도
                            </span>
                            <input
                                type="range"
                                min="0"
                                max="0.5"
                                step="0.0001"
                                value={explosion}
                                onChange={(e) => setExplosion(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, rgb(0,255,133) 0%, rgb(0,255,133) ${(explosion/0.5)*100}%, rgba(255,255,255,0.1) ${(explosion/0.5)*100}%, rgba(255,255,255,0.1) 100%)`
                                }}
                            />
                            <span className="text-xs font-mono text-[rgb(0,255,133)] min-w-[40px] text-right">
                                {Math.round((explosion/0.5)*100)}%
                            </span>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-xs text-[rgba(255,255,255,0.5)]">
                            <div className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> <span>Rotate & Select</span>
                            </div>
                            <div className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] rounded-lg flex items-center gap-2">
                                <ZoomIn className="w-4 h-4" /> <span>Scroll to zoom</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Panel Toggle Button */}
                <button
                    onClick={() => setRightPanelOpen(!rightPanelOpen)}
                    className="absolute top-1/2 -translate-y-1/2 z-50 w-10 h-20 bg-[rgb(0,255,133)] hover:bg-[rgb(0,230,120)] rounded-l-lg flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,255,133,0.4)]"
                    style={{ right: rightPanelOpen ? '384px' : '0px' }}
                >
                    {rightPanelOpen ? <ChevronRight className="w-5 h-5 text-black" /> : <ChevronLeft className="w-5 h-5 text-black" />}
                </button>

                {/* 4. Right Sidebar (부품 설명 추가됨) */}
                <aside
                    className={`flex-shrink-0 border-l border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.8)] flex flex-col transition-all duration-300 z-40 overflow-hidden ${
                        rightPanelOpen ? 'w-96' : 'w-0'
                    }`}
                >
                    <div className="w-96 flex flex-col h-full">
                        {/* 탭 헤더 */}
                        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-[rgba(255,255,255,0.08)]">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMainTab('ai')}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                        mainTab === 'ai'
                                            ? 'bg-transparent border-b-2 border-[rgb(0,255,133)] text-[rgb(0,255,133)]'
                                            : 'bg-transparent text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.9)]'
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4" /> AI 어시스턴트
                                </button>
                                <button
                                    onClick={() => setMainTab('notes')}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                        mainTab === 'notes'
                                            ? 'bg-transparent border-b-2 border-[rgb(0,255,133)] text-[rgb(0,255,133)]'
                                            : 'bg-transparent text-[rgba(255,255,255,0.6)] hover:text-[rgba(255,255,255,0.9)]'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" /> 학습 노트
                                </button>
                            </div>
                        </div>

                        {/* AI 탭 컨텐츠 */}
                        {mainTab === 'ai' && (
                            <>
                                <div className="flex-shrink-0 p-5 border-b border-[rgba(255,255,255,0.08)]">
                                    <div className="grid grid-cols-2 gap-2">
                                        {['explain', 'function', 'assembly', 'theory'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveAiTab(tab)}
                                                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors capitalize ${
                                                    activeAiTab === tab
                                                        ? 'bg-[rgb(0,255,133)] text-black'
                                                        : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)]'
                                                }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="w-full mt-3 px-3 py-2 text-xs font-medium rounded-lg bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                                        Quiz
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    {/* ✅ 선택된 부품 상세 정보 표시 */}
                                    {selectedPartInfo ? (
                                        <div className="mb-4">
                                            <div className="bg-[rgba(0,255,133,0.08)] border border-[rgba(0,255,133,0.3)] rounded-xl p-5 shadow-[0_0_20px_rgba(0,255,133,0.1)]">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Info className="w-4 h-4 text-[rgb(0,255,133)]" />
                                                    <h3 className="text-[rgb(0,255,133)] font-bold text-sm uppercase tracking-wide">
                                                        {getPartName(selectedPartInfo.url)}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-white/90 leading-relaxed">
                                                    {selectedPartInfo.description}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4 p-5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl text-center">
                                            <p className="text-sm text-white/50">
                                                3D 뷰어에서 부품을 클릭하면<br/>상세 설명이 표시됩니다.
                                            </p>
                                        </div>
                                    )}

                                    {/* 체크된 그룹 표시 */}
                                    {activeCheckedNames.length > 0 && (
                                        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4 mb-4">
                                            <div className="text-white/60 text-xs font-bold mb-2">체크된 그룹</div>
                                            <div className="flex flex-wrap gap-2">
                                                {activeCheckedNames.map(name => (
                                                    <span key={name} className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/80 border border-white/10">{name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg p-4">
                                        <p className="text-sm text-[rgba(255,255,255,0.8)] leading-relaxed">
                                            {activeAiTab === 'explain' && 'AI 어시스턴트: 궁금한 부품을 선택하거나 질문해주세요.'}
                                            {activeAiTab === 'function' && '각 부품의 기능과 작동 원리를 상세히 설명해드립니다.'}
                                            {activeAiTab === 'assembly' && '모델의 조립 순서와 각 부품의 결합 방식을 안내합니다.'}
                                            {activeAiTab === 'theory' && '관련된 공학 이론과 원리를 깊이 있게 학습할 수 있습니다.'}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleAiSubmit} className="flex-shrink-0 p-5 border-t border-[rgba(255,255,255,0.08)]">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            placeholder="부품이나 구조에 대해 질문하세요..."
                                            className="flex-1 px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[rgb(0,255,133)] transition-colors"
                                        />
                                        <button type="submit" className="w-10 h-10 flex items-center justify-center bg-[rgb(0,255,133)] text-black rounded-lg hover:bg-[rgb(0,230,120)] transition-colors flex-shrink-0">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* 노트 탭 컨텐츠 */}
                        {mainTab === 'notes' && (
                            <>
                                <div className="flex-shrink-0 p-5 border-b border-[rgba(255,255,255,0.08)]">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-white">나의 학습 노트</h4>
                                        <button className="px-3 py-1.5 bg-transparent border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] rounded-lg hover:border-[rgb(0,255,133)] hover:text-[rgb(0,255,133)] transition-colors text-xs flex items-center gap-2">
                                            <Download className="w-3 h-3" /> PDF 내보내기
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-5">
                                    <textarea
                                        value={userNote}
                                        onChange={(e) => setUserNote(e.target.value)}
                                        placeholder="학습 내용을 메모하세요..."
                                        className="w-full h-full p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm placeholder:text-[rgba(255,255,255,0.4)] resize-none focus:outline-none focus:border-[rgb(0,255,133)] transition-colors"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}