import React, { useRef, useState } from 'react';
import { useXRHitTest, useXR } from '@react-three/xr';
import { Matrix4, Vector3 } from 'three';

const matrixHelper = new Matrix4();

const ARReticle = ({ children }) => {
  const reticleRef = useRef();
  const [placedPosition, setPlacedPosition] = useState(null);
  const isAR = useXR(state => state.mode === 'immersive-ar');

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (!isAR || placedPosition) return;

      if (results.length > 0 && reticleRef.current) {
        getWorldMatrix(matrixHelper, results[0]);
        const position = new Vector3().setFromMatrixPosition(matrixHelper);
        reticleRef.current.position.copy(position);
        reticleRef.current.visible = true;
      } else if (reticleRef.current) {
        reticleRef.current.visible = false;
      }
    },
    'viewer'
  );

  const placeScene = () => {
    if (isAR && reticleRef.current && reticleRef.current.visible && !placedPosition) {
      setPlacedPosition(reticleRef.current.position.clone());
    }
  };

  if (!isAR) {
    // Not in AR, render children normally
    return <group>{children}</group>;
  }

  return (
    <group onPointerDown={placeScene}>
      {!placedPosition && (
        <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.1, 0.2, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
        </mesh>
      )}
      
      {placedPosition && (
        <group position={placedPosition}>
          {children}
        </group>
      )}
    </group>
  );
};

export default ARReticle;
