import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Droplets, Sparkles, Activity, ShieldCheck, RefreshCw, ZoomIn } from 'lucide-react';

interface ThreeBloodSceneProps {
  activeBloodGroup?: string;
}

export const ThreeBloodScene: React.FC<ThreeBloodSceneProps> = ({ activeBloodGroup = 'O-' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [interactiveMode, setInteractiveMode] = useState<'cells' | 'vitals' | 'drop'>('cells');
  const [pulseSpeed, setPulseSpeed] = useState<number>(1);
  const [activeComponent, setActiveComponent] = useState<'erythrocytes' | 'plasma' | 'platelets'>('erythrocytes');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff4d6d, 2.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4a72c, 1.8);
    dirLight2.position.set(-8, -5, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe11d48, 4, 30);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Create realistic Biconcave Red Blood Cell (Erythrocyte) Geometry
    function createErythrocyteGeometry(radius = 2.2, height = 0.9, segments = 48) {
      const geom = new THREE.CylinderGeometry(radius, radius, height, segments, 16);
      const pos = geom.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const r = Math.sqrt(v.x * v.x + v.z * v.z);
        const normalizedR = r / radius;

        // Shape into standard biconcave disc: thicker rim, dimpled center
        if (v.y > 0) {
          const dimple = Math.sin(normalizedR * Math.PI) * 0.45 - (1 - normalizedR * normalizedR) * 0.35;
          v.y = Math.max(0.12, v.y * 0.7 + dimple);
        } else {
          const dimple = Math.sin(normalizedR * Math.PI) * 0.45 - (1 - normalizedR * normalizedR) * 0.35;
          v.y = Math.min(-0.12, v.y * 0.7 - dimple);
        }
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geom.computeVertexNormals();
      return geom;
    }

    // Material for Erythrocytes: deep blood crimson with organic specular sheen
    const rbcMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      emissive: 0x59041a,
      roughness: 0.22,
      metalness: 0.1,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      transmission: 0.25,
      thickness: 1.2
    });

    const goldenCellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4a72c,
      emissive: 0x473104,
      roughness: 0.2,
      metalness: 0.3,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });

    // Central primary Erythrocyte
    const primaryRBCGeom = createErythrocyteGeometry(2.3, 0.95);
    const primaryRBC = new THREE.Mesh(primaryRBCGeom, rbcMaterial);
    primaryRBC.rotation.x = 0.5;
    primaryRBC.rotation.z = 0.3;
    mainGroup.add(primaryRBC);

    // Orbiting secondary cells
    const orbitingCells: THREE.Mesh[] = [];
    const cellGeom = createErythrocyteGeometry(1.2, 0.55);

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const distance = 5.5 + (i % 2) * 1.5;
      const mesh = new THREE.Mesh(cellGeom, i === 2 ? goldenCellMaterial : rbcMaterial);
      mesh.position.set(
        Math.cos(angle) * distance,
        (Math.sin(i * 1.8) * 2.2),
        Math.sin(angle) * distance * 0.6
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      orbitingCells.push(mesh);
      mainGroup.add(mesh);
    }

    // Floating Hemoglobin / Oxygen / Platelet micro-particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCrimson = new THREE.Color(0xf43f5e);
    const cGold = new THREE.Color(0xfbbf24);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 24;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 18;

      const pickColor = Math.random() > 0.65 ? cGold : (Math.random() > 0.4 ? cCrimson : cWhite);
      colors[i3] = pickColor.r;
      colors[i3 + 1] = pickColor.g;
      colors[i3 + 2] = pickColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * pulseSpeed;

      // Heartbeat pulse calculation (systolic + diastolic double-beat)
      const heartbeat = (Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 6) * 0.35) * 0.06;
      const baseScale = 1 + heartbeat;
      primaryRBC.scale.set(baseScale, baseScale, baseScale);

      // Smooth group rotation with momentum
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08 + 0.003;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

      // Primary cell organic tumble
      primaryRBC.rotation.x += 0.004;
      primaryRBC.rotation.z += 0.003;

      // Orbiting cells dynamics
      orbitingCells.forEach((cell, idx) => {
        const offset = idx * 0.9;
        cell.position.y += Math.sin(elapsedTime * 1.5 + offset) * 0.015;
        cell.rotation.x += 0.01;
        cell.rotation.y += 0.008;
      });

      // Micro particles slow float
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      primaryRBCGeom.dispose();
      rbcMaterial.dispose();
      goldenCellMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [pulseSpeed]);

  return (
    <div className="relative w-full h-[400px] md:h-[460px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#14213D] via-[#0d1627] to-[#090e18] border border-rose-900/40 shadow-2xl">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-rose-500/40 text-xs font-semibold text-rose-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Interactive 3D Erythrocyte Engine</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-xs font-semibold text-amber-300">
          Target Blood: <span className="text-white font-extrabold">{activeBloodGroup}</span>
        </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setPulseSpeed(p => (p === 1 ? 1.8 : p === 1.8 ? 0.5 : 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white hover:border-rose-400 transition"
          title="Toggle Hemodynamic Pulse Speed"
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          <span>Pulse: {pulseSpeed === 1 ? '72 BPM' : pulseSpeed > 1 ? '120 BPM' : '50 BPM'}</span>
        </button>
      </div>

      {/* Component Selector Tabs */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-slate-800/90 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveComponent('erythrocytes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeComponent === 'erythrocytes'
                ? 'bg-[#E11D48] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Red Blood Cells (RBCs)</span>
          </button>
          <button
            onClick={() => setActiveComponent('plasma')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeComponent === 'plasma'
                ? 'bg-[#D4A72C] text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plasma (Golden Fluid)</span>
          </button>
          <button
            onClick={() => setActiveComponent('platelets')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeComponent === 'platelets'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platelets (Hemostasis)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
          <span>Click & drag to inspect 3D biconcave cellular morphology</span>
        </div>
      </div>
    </div>
  );
};
