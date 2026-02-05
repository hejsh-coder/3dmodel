import React, { useState, Suspense, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box, ArrowRight, RotateCcw, Move, Rotate3D, Maximize, FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button'; // 새로 만든 버튼
import { GlassCard } from '../components/GlassCard'; // 새로 만든 카드

// ... (ToolbarBtn, CameraRig, DraggablePart 컴포넌트는 기존 로직 유지하되 스타일만 Tailwind로 변경) ...

const ToolbarBtn = ({ icon: Icon, active, onClick, tooltip }) => (
    <button
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
            active
                ? 'bg-[rgb(0,255,133)] text-black shadow-[0_0_15px_rgba(0,255,133,0.4)]'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
        title={tooltip}
    >
        <Icon className="w-5 h-5" />
    </button>
);

// ... (DraggablePart, CameraRig 등 기존 로직 컴포넌트들 여기에 그대로 복사) ...
function CameraRig({ targetPosition }) {
    const { camera, controls } = useThree();
    useFrame((state, delta) => {
        if (!targetPosition) return;
        if (controls) {
            controls.target.lerp(targetPosition, 0.1);
            controls.update();
        }
        const desiredCameraPos = new THREE.Vector3(targetPosition.x + 0.5, targetPosition.y + 0.5, targetPosition.z + 0.5);
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
                <TransformControls object={meshRef} mode={transformMode} onMouseUp={() => {}} />
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

export default function StudyPage() {
    const navigate = useNavigate();

    // ... (기존 상태값들: explosion, selectedId, transformMode 등 유지) ...
    const [explosion, setExplosion] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [transformMode, setTransformMode] = useState("translate");
    const [focusTarget, setFocusTarget] = useState(null);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [userNote, setUserNote] = useState('');
    const [checkedGroups, setCheckedGroups] = useState({});

    // ... (assemblyParts 데이터 및 로직 함수들 기존 그대로 유지) ...
    const assemblyParts = useMemo(() => [
        { id: "base_gear", url: "/models/BaseGear.glb", defaultPos: [0.0076, 0.0178, -0.0027], direction: [0, -0.2, 0], rotation: [0.0000, -1.5706, 0.0000] },
        { id: "mounting_bracket", url: "/models/BaseMountingbracket.glb", defaultPos: [0.0101, -0.0053, 0.0060], direction: [0, 0.2, 0], rotation: [-0.1133, 1.5241, 1.6775] },
        // ... (나머지 부품 데이터 생략, 기존 코드 그대로 사용) ...
        { id: "base_plate", url: "/models/BasePlate.glb", defaultPos: [0, 0, 0], direction: [0, -0.2, 0], rotation: [0, 0, 0] },
    ], []);

    const groupedParts = useMemo(() => {
        const groups = {};
        assemblyParts.forEach(part => {
            if (!groups[part.url]) groups[part.url] = [];
            groups[part.url].push(part);
        });
        return groups;
    }, [assemblyParts]);

    const [visibleParts, setVisibleParts] = useState(Object.fromEntries(assemblyParts.map(p => [p.id, true])));

    const toggleGroupVisibility = (url) => {
        const partsInGroup = groupedParts[url];
        const newStatus = !visibleParts[partsInGroup[0].id];
        const newMap = { ...visibleParts };
        partsInGroup.forEach(p => newMap[p.id] = newStatus);
        setVisibleParts(newMap);
    };

    const toggleCheckbox = (url) => setCheckedGroups(prev => ({ ...prev, [url]: !prev[url] }));
    const getPartName = (url) => url.split('/').pop().replace('.glb', '');
    const handleDoubleClick = (url) => { /* 카메라 로직 */ };
    const activeCheckedNames = Object.keys(checkedGroups).filter(url => checkedGroups[url]).map(url => getPartName(url));


    return (
        <div className="flex flex-col h-screen w-screen bg-[#020617] text-white overflow-hidden font-sans">
            {/* 1. 헤더 (디자인 변경) */}
            <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Box className="w-6 h-6 text-[rgb(0,255,133)]" />
                        <span className="text-xl font-bold tracking-wide">SIMVEX</span>
                    </div>
                    <nav className="flex gap-6">
                        <button className="text-[rgb(0,255,133)] border-b-2 border-[rgb(0,255,133)] pb-1 text-sm font-bold">STUDY</button>
                        <button className="text-white/60 hover:text-white transition-colors text-sm font-medium">CAD</button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex min-h-0 relative">
                {/* 2. 왼쪽 사이드바 (GlassCard 적용) */}
                <aside className="w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
                    <div className="p-5 border-b border-white/10">
                        <h3 className="text-xs font-bold text-[rgb(0,255,133)] tracking-widest uppercase">COMPONENTS</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {Object.entries(groupedParts).map(([url, parts]) => (
                            <div key={url} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${checkedGroups[url] ? 'bg-[rgba(0,255,133,0.1)] border-[rgba(0,255,133,0.3)]' : 'border-transparent hover:bg-white/5'}`} onClick={() => setSelectedId(parts[0].id)}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${checkedGroups[url] ? 'bg-[rgb(0,255,133)] border-[rgb(0,255,133)]' : 'border-white/30'}`} onClick={(e) => { e.stopPropagation(); toggleCheckbox(url); }}>
                                        {checkedGroups[url] && <CheckCircle className="w-3 h-3 text-black" />}
                                    </div>
                                    <span className={`text-sm ${selectedId === parts[0].id ? 'text-[rgb(0,255,133)] font-bold' : 'text-white/70'}`}>{getPartName(url)}</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(url); }} className="text-white/40 hover:text-white">
                                    {visibleParts[parts[0].id] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* 3. 3D 뷰포트 (배경은 투명하게 하여 body 배경 사용) */}
                <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_rgba(0,40,20,0.4)_0%,_transparent_100%)]">
                    {/* 툴바 */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
                        <GlassCard className="flex items-center gap-2 px-4 py-2 !rounded-2xl">
                            <ToolbarBtn icon={Move} active={transformMode === 'translate'} onClick={() => setTransformMode('translate')} />
                            <ToolbarBtn icon={Rotate3D} active={transformMode === 'rotate'} onClick={() => setTransformMode('rotate')} />
                            <div className="w-[1px] h-6 bg-white/10 mx-2" />
                            <ToolbarBtn icon={Maximize} onClick={() => {}} />
                            <ToolbarBtn icon={RotateCcw} onClick={() => {}} />
                        </GlassCard>
                    </div>

                    <Canvas shadows camera={{ position: [0.8, 0.8, 0.8], fov: 35 }}>
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

                    {/* 하단 슬라이더 */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 max-w-lg z-50">
                        <GlassCard className="px-6 py-4">
                            <input type="range" min="0" max="0.5" step="0.0001" value={explosion} onChange={(e) => setExplosion(parseFloat(e.target.value))} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[rgb(0,255,133)] [&::-webkit-slider-thumb]:rounded-full" />
                        </GlassCard>
                    </div>
                </section>

                {/* 4. 오른쪽 사이드바 (AI 채팅) */}
                <aside className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col z-40">
                    <div className="p-5 border-b border-white/10">
                        <h3 className="text-xs font-bold text-[rgb(0,255,133)] tracking-widest uppercase">AI ANALYST</h3>
                    </div>
                    <div className="flex-1 p-5">
                        {activeCheckedNames.length > 0 ? (
                            <div className="bg-[rgba(0,255,133,0.1)] border border-[rgba(0,255,133,0.3)] p-4 rounded-xl">
                                <div className="text-[rgb(0,255,133)] text-xs font-bold mb-2">선택된 부품 분석 중...</div>
                                <div className="flex flex-wrap gap-2">
                                    {activeCheckedNames.map(name => (
                                        <span key={name} className="px-2 py-1 bg-black/40 rounded text-xs text-white border border-white/10">{name}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-white/40 text-sm mt-10">부품을 선택해주세요.</div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <input type="text" placeholder="AI에게 질문하기..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[rgb(0,255,133)] outline-none" />
                    </div>
                </aside>
            </main>
        </div>
    );
}