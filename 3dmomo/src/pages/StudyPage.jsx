import React, { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box, ArrowRight, RotateCcw, Move, Rotate3D, Maximize, FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';

/* -------------------------------------------------------------------------- */
/* 하위 컴포넌트                                                               */
/* -------------------------------------------------------------------------- */

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
                    onMouseUp={() => {
                        if (meshRef.current) {
                            const { x, y, z } = meshRef.current.position;
                            const { x: rx, y: ry, z: rz } = meshRef.current.rotation;
                            console.log(`\n🚀 [ID: ${part.id}] 정밀 데이터:`);
                            console.log(`defaultPos: [${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)}],`);
                            console.log(`rotation: [${rx.toFixed(4)}, ${ry.toFixed(4)}, ${rz.toFixed(4)}],`);
                        }
                    }}
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
    const [transformMode, setTransformMode] = useState("translate"); // translate | rotate
    const [focusTarget, setFocusTarget] = useState(null);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [userNote, setUserNote] = useState('');
    const [checkedGroups, setCheckedGroups] = useState({});

    // ✅ 복구된 18개 부품 데이터 (사용자님의 원본 데이터)
    const assemblyParts = useMemo(() => [
        { id: "base_gear", url: "/models/BaseGear.glb", defaultPos: [0.0076, 0.0178, -0.0027], direction: [0, -0.2, 0], rotation: [0.0000, -1.5706, 0.0000] },
        { id: "mounting_bracket", url: "/models/BaseMountingbracket.glb", defaultPos: [0.0101, -0.0053, 0.0060], direction: [0, 0.2, 0], rotation: [-0.1133, 1.5241, 1.6775] },
        { id: "base_plate", url: "/models/BasePlate.glb", defaultPos: [0, 0, 0], direction: [0, -0.2, 0], rotation: [0, 0, 0] },
        { id: "gear_link_1", url: "/models/Gearlink1.glb", defaultPos: [0.0136, 0.0378, 0.0048], direction: [0.2, 0.2, 0], rotation: [1.5754, -0.0569, -1.5434] },
        { id: "gear_link_2", url: "/models/Gearlink2.glb", defaultPos: [-0.0136, 0.0378, 0.0062], direction: [-0.2, 0.2, 0], rotation: [-3.1374, -0.0061, -1.7756] },
        { id: "link_L", url: "/models/Link.glb", defaultPos: [-0.0064, 0.0740, 0.0048], direction: [-0.3, 0.1, 0], rotation: [-1.5713, -0.0883, -1.5496] },
        { id: "link_R", url: "/models/Link.glb", defaultPos: [0.0060, 0.0739, 0.0049], direction: [0.3, 0.1, 0], rotation: [-1.5634, 0.0671, -1.5615] },
        { id: "gripper_L", url: "/models/Gripper.glb", defaultPos: [-0.0031, 0.0870, 0.0000], direction: [-0.3, 0, 0.2], rotation: [-0.0002, 0.0284, 1.1878] },
        { id: "gripper_R", url: "/models/Gripper.glb", defaultPos: [0.0027, 0.0870, 0.0012], direction: [0.3, 0, 0.2], rotation: [-3.1414, -0.0374, -1.9538] },
        { id: "Pin_01", url: "/models/Pin.glb", defaultPos: [0.0052, 0.0585, 0.0024], direction: [0.2, 0.2, 0.2], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_02", url: "/models/Pin.glb", defaultPos: [-0.0075, 0.0895, 0.0024], direction: [-0.2, 0.2, 0.2], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_03", url: "/models/Pin.glb", defaultPos: [0.0154, 0.0689, 0.0020], direction: [0.2, 0.2, -0.2], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_04", url: "/models/Pin.glb", defaultPos: [-0.0154, 0.0689, 0.0020], direction: [-0.2, 0.2, -0.2], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_05", url: "/models/Pin.glb", defaultPos: [0.0073, 0.0894, 0.0024], direction: [0.3, 0.1, 0], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_06", url: "/models/Pin.glb", defaultPos: [-0.0136, 0.0377, 0.0025], direction: [-0.3, 0.1, 0], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_07", url: "/models/Pin.glb", defaultPos: [0.0141, 0.0377, 0.0025], direction: [0, 0.1, 0.3], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_08", url: "/models/Pin.glb", defaultPos: [-0.0048, 0.0584, 0.0024], direction: [0, 0.1, -0.3], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_09", url: "/models/Pin.glb", defaultPos: [0.0053, 0.0034, 0.0022], direction: [0.1, 0, 0.2], rotation: [3.1416, -1.5402, 3.1416] },
        { id: "Pin_10", url: "/models/Pin.glb", defaultPos: [-0.0053, 0.0034, 0.0022], direction: [-0.1, 0, 0.2], rotation: [3.1416, -1.5402, 3.1416] },
    ], []);

    // 그룹화 및 가시성 로직
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

    const activeCheckedNames = Object.keys(checkedGroups)
        .filter(url => checkedGroups[url])
        .map(url => getPartName(url));

    return (
        <div className="flex flex-col h-screen w-screen bg-[#020617] text-white overflow-hidden font-sans">
            {/* 1. 헤더 */}
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
                            <div
                                key={url}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                    checkedGroups[url]
                                        ? 'bg-[rgba(0,255,133,0.1)] border-[rgba(0,255,133,0.3)]'
                                        : 'border-transparent hover:bg-white/5'
                                }`}
                                onClick={() => setSelectedId(parts[0].id)}
                                onDoubleClick={() => handleDoubleClick(url)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                                            checkedGroups[url]
                                                ? 'bg-[rgb(0,255,133)] border-[rgb(0,255,133)]'
                                                : 'border-white/30'
                                        }`}
                                        onClick={(e) => { e.stopPropagation(); toggleCheckbox(url); }}
                                    >
                                        {checkedGroups[url] && <CheckCircle className="w-3 h-3 text-black" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm ${selectedId === parts[0].id ? 'text-[rgb(0,255,133)] font-bold' : 'text-white/70'}`}>
                                            {getPartName(url)}
                                        </span>
                                        {parts.length > 1 && <span className="text-[10px] text-white/40">x{parts.length}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(url); }}
                                    className="text-white/40 hover:text-white"
                                >
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
                            <ToolbarBtn icon={Move} active={transformMode === 'translate'} onClick={() => setTransformMode('translate')} tooltip="이동 (T)" />
                            <ToolbarBtn icon={Rotate3D} active={transformMode === 'rotate'} onClick={() => setTransformMode('rotate')} tooltip="회전 (R)" />
                            <div className="w-[1px] h-6 bg-white/10 mx-2" />
                            <ToolbarBtn icon={Maximize} onClick={() => {}} tooltip="전체화면" />
                            <ToolbarBtn icon={RotateCcw} onClick={() => {}} tooltip="초기화" />
                        </GlassCard>
                    </div>

                    <Canvas shadows camera={{ position: [0.8, 0.8, 0.8], fov: 35 }}>
                        <Suspense fallback={null}>
                            <CameraRig targetPosition={focusTarget} />
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} intensity={1.5} castShadow />
                            {/* 네온 그린 그리드 적용 */}
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
                        <GlassCard className="px-6 py-4 flex items-center gap-4">
                            <span className="text-xs text-[rgb(0,255,133)] font-bold">EXPLODE</span>
                            <input
                                type="range"
                                min="0"
                                max="0.5"
                                step="0.0001"
                                value={explosion}
                                onChange={(e) => setExplosion(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[rgb(0,255,133)] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                            />
                        </GlassCard>
                    </div>
                </section>

                {/* 4. 오른쪽 사이드바 (AI 채팅) */}
                <aside className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 flex flex-col z-40">
                    <div className="p-5 border-b border-white/10">
                        <h3 className="text-xs font-bold text-[rgb(0,255,133)] tracking-widest uppercase">AI ANALYST</h3>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto">
                        {activeCheckedNames.length > 0 ? (
                            <div className="bg-[rgba(0,255,133,0.1)] border border-[rgba(0,255,133,0.3)] p-4 rounded-xl mb-4">
                                <div className="text-[rgb(0,255,133)] text-xs font-bold mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[rgb(0,255,133)] rounded-full animate-pulse"></div>
                                    분석 대상
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {activeCheckedNames.map(name => (
                                        <span key={name} className="px-2 py-1 bg-black/40 rounded text-[10px] text-white border border-white/10">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-white/40 text-xs mt-10 p-6 border border-dashed border-white/10 rounded-xl">
                                왼쪽 리스트에서 부품을 선택하면<br/>AI가 구조를 분석합니다.
                            </div>
                        )}
                        {/* 여기에 AI 채팅 메시지나 분석 결과가 표시될 공간 */}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="구조나 원리에 대해 질문하세요..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[rgb(0,255,133)] outline-none placeholder:text-white/30"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(0,255,133)] hover:text-white transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}