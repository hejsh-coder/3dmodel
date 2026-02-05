import React, { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';

/* -------------------------------------------------------------------------- */
/* 하위 컴포넌트                                */
/* -------------------------------------------------------------------------- */

/** 1. 툴바용 버튼 컴포넌트 (재사용) */
const ToolbarBtn = ({ icon, active, onClick, tooltip }) => (
    <button
        onClick={onClick}
        className={`group relative w-8 h-8 flex items-center justify-center rounded-md transition-all ${
            active
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <i className={`fa-solid ${icon} text-sm`}></i>
        {/* 툴팁 */}
        {tooltip && (
            <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700">
                {tooltip}
            </span>
        )}
    </button>
);

/** 2. 툴바 구분선 */
const ToolbarDivider = () => (
    <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>
);

/** 3. 카메라 리그 */
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

/** 4. 3D 부품 컴포넌트 */
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
/* 메인 페이지                                 */
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

    // 18개 부품 데이터 (기존 유지)
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
        <div className="flex flex-col h-screen w-screen bg-[#020617] text-[#f8fafc] overflow-hidden font-sans">
            <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-50">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black tracking-tighter text-sky-400 italic">SIMVEX</h1>
                    <nav className="flex gap-8">
                        <button className="text-white border-b-2 border-sky-500 pb-1 text-sm font-bold">Study</button>
                        <button className="text-slate-500 text-sm font-medium">CAD</button>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex min-h-0 overflow-hidden relative">

                {/* 왼쪽 사이드바 */}
                <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col flex-shrink-0 z-40">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-sky-500 tracking-widest uppercase italic">Components</h3>
                        <span className="text-[9px] text-slate-500">List & Control</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {Object.entries(groupedParts).map(([url, parts]) => {
                            const partName = getPartName(url);
                            const isGroupVisible = visibleParts[parts[0].id];
                            const isChecked = !!checkedGroups[url];

                            return (
                                <div
                                    key={url}
                                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer border border-transparent select-none ${isChecked ? 'bg-sky-500/5 border-sky-500/20' : 'hover:bg-white/[0.03]'}`}
                                    onClick={() => setSelectedId(parts[0].id)}
                                    onDoubleClick={() => handleDoubleClick(url)}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleCheckbox(url)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-sky-500"
                                        />
                                        <div className="flex items-center gap-2 truncate">
                                            <span className={`text-[11px] font-bold truncate ${selectedId === parts[0].id ? 'text-sky-400' : 'text-slate-400'}`}>
                                                {partName}
                                            </span>
                                            {parts.length > 1 && (
                                                <span className="text-[9px] bg-slate-800 text-sky-500 px-1.5 rounded-md font-mono">x{parts.length}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(url); }}
                                        className={`p-1.5 rounded-md transition-colors ${isGroupVisible ? 'text-slate-600 hover:text-white' : 'text-red-500 bg-red-500/10'}`}
                                    >
                                        <i className={`fa-solid ${isGroupVisible ? 'fa-eye' : 'fa-eye-slash'} text-[10px]`}></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* 중앙 3D 뷰포트 */}
                <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)] min-w-0 overflow-hidden">

                    {/* [NEW] CAD 스타일 툴바 */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg flex items-center p-1 shadow-xl gap-1">
                        {/* 그룹 1: 파일/링크 */}
                        <ToolbarBtn icon="fa-folder-open" tooltip="Open File" />
                        <ToolbarBtn icon="fa-link" tooltip="Link Source" />

                        <ToolbarDivider />

                        {/* 그룹 2: 뷰/화면 */}
                        <ToolbarBtn icon="fa-expand" tooltip="Fit to Screen" />
                        <ToolbarBtn icon="fa-arrows-rotate" tooltip="Reset View" />
                        <ToolbarBtn icon="fa-up-down" tooltip="Top/Bottom View" />

                        <ToolbarDivider />

                        {/* 그룹 3: Transform (실제 기능 연결됨) */}
                        <ToolbarBtn
                            icon="fa-arrow-pointer"
                            active={transformMode === 'translate'}
                            onClick={() => setTransformMode('translate')}
                            tooltip="Select & Move (T)"
                        />
                        <ToolbarBtn
                            icon="fa-rotate"
                            active={transformMode === 'rotate'}
                            onClick={() => setTransformMode('rotate')}
                            tooltip="Rotate (R)"
                        />

                        <ToolbarDivider />

                        {/* 그룹 4: 렌더링 모드 */}
                        <ToolbarBtn icon="fa-cube" active={true} tooltip="Shaded Mode" />
                        <ToolbarBtn icon="fa-border-all" tooltip="Wireframe Mode" />

                        <ToolbarDivider />

                        {/* 그룹 5: 도구 */}
                        <ToolbarBtn icon="fa-ruler-combined" tooltip="Measure" />
                        <ToolbarBtn icon="fa-camera" tooltip="Screenshot" />
                        <ToolbarBtn icon="fa-gear" tooltip="Settings" />
                    </div>

                    <Canvas shadows camera={{ position: [0.8, 0.8, 0.8], fov: 35 }}>
                        <Suspense fallback={null}>
                            <CameraRig targetPosition={focusTarget} />
                            <ambientLight intensity={0.6} />
                            <pointLight position={[5, 5, 5]} intensity={1.5} />
                            <Grid infiniteGrid cellSize={0.01} sectionSize={0.05} sectionColor="#38bdf8" cellColor="#0f172a" opacity={0.2} />
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
                            <ContactShadows position={[0, -0.05, 0]} opacity={0.5} scale={3} />
                            <Environment preset="night" />
                        </Suspense>
                        <OrbitControls makeDefault minDistance={0.1} maxDistance={3} />
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} onClick={() => setSelectedId(null)}>
                            <planeGeometry args={[50, 50]} /><meshBasicMaterial transparent opacity={0} />
                        </mesh>
                    </Canvas>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[60%] max-w-md bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 z-30">
                        <input type="range" min="0" max="0.5" step="0.0001" value={explosion} onChange={(e) => setExplosion(parseFloat(e.target.value))} className="w-full h-1 appearance-none cursor-pointer accent-sky-500 bg-slate-800 rounded-lg" />
                    </div>

                    {/* 플로팅 노트 버튼 */}
                    <button
                        onClick={() => setIsNoteOpen(!isNoteOpen)}
                        className={`absolute bottom-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-110 active:scale-95 ${isNoteOpen ? 'right-[22rem] bg-white text-slate-900 rotate-45' : 'right-8 bg-sky-500 text-white'}`}
                    >
                        <i className={`fa-solid ${isNoteOpen ? 'fa-plus' : 'fa-pen'} text-xl`}></i>
                    </button>

                    {/* 노트 패널 */}
                    <div className={`absolute top-0 bottom-0 right-0 bg-slate-900/95 border-l border-white/10 flex flex-col transition-all duration-300 ease-in-out z-40 backdrop-blur-lg shadow-2xl ${isNoteOpen ? 'w-80 translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0 pointer-events-none'}`}>
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center w-80">
                            <h3 className="text-[12px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-note-sticky"></i> Engineering Note
                            </h3>
                        </div>
                        <div className="flex-1 p-5 flex flex-col w-80">
                            <textarea
                                value={userNote}
                                onChange={(e) => setUserNote(e.target.value)}
                                placeholder="기록할 내용을 입력하세요..."
                                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed outline-none focus:border-sky-500/50 resize-none placeholder:text-slate-700 font-mono"
                            />
                            <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500">
                                <span>{userNote.length} chars</span>
                                <button className="text-sky-400 hover:text-white transition-colors">Save</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 오른쪽 사이드바 */}
                <aside className="w-80 bg-slate-950 border-l border-white/5 flex flex-col flex-shrink-0 hidden lg:flex z-50">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="text-[10px] font-black text-sky-500 tracking-widest uppercase italic">AI Analyst</h3>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto space-y-4">
                        {activeCheckedNames.length > 0 ? (
                            <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-sky-400 uppercase">Analysis Target</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {activeCheckedNames.map(name => (
                                        <span key={name} className="px-2 py-1 bg-sky-900/50 rounded text-[10px] text-sky-200 border border-sky-500/20">{name}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-[11px] text-slate-500 italic bg-slate-900/50 p-4 rounded-xl border border-white/5 text-center">
                                왼쪽 리스트에서 부품을 체크하세요.
                            </div>
                        )}
                    </div>
                    <div className="p-5 border-t border-slate-800 bg-slate-950/80">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="AI에게 질문..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-10 text-xs text-white focus:border-sky-500 outline-none transition-all placeholder:text-slate-600"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-300">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}