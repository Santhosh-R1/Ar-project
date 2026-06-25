import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { XR, useXR } from '@react-three/xr';
import { xrStore } from '../store/xrStore';
import useStore from '../hooks/useStore';
import { ConstructionObject } from './Objects';
import ARReticle from './ARReticle';

const SceneContent = () => {
  const { objects, theme } = useStore();
  const isAR = useXR(state => state.mode === 'immersive-ar');

  return (
    <>
      {!isAR && <color attach="background" args={[theme === 'Dark' ? '#0f172a' : '#f8fafc']} />}
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        castShadow 
        position={[10, 20, 10]} 
        intensity={1} 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {!isAR && (
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          sectionColor={theme === 'Dark' ? '#334155' : '#cbd5e1'} 
          cellColor={theme === 'Dark' ? '#1e293b' : '#e2e8f0'} 
        />
      )}

      <ARReticle>
        <group>
          {objects.map((obj) => (
            <ConstructionObject key={obj.id} objectData={obj} />
          ))}
        </group>
      </ARReticle>

      {!isAR && <OrbitControls makeDefault />}
      {!isAR && <Environment preset="city" />}
    </>
  );
};

const Scene = () => {
  const { selectObject, theme } = useStore();

  const handlePointerMissed = (e) => {
    // Deselect if clicking on empty space
    if (e.type === 'click') {
      selectObject(null);
    }
  };

  return (
    <div className={`flex-1 h-full relative ${theme === 'Dark' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Canvas 
        shadows 
        camera={{ position: [10, 10, 10], fov: 50 }}
        onPointerMissed={handlePointerMissed}
      >
        <XR store={xrStore}>
          <SceneContent />
        </XR>
      </Canvas>
    </div>
  );
};

export default Scene;
