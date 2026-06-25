import React, { useRef } from 'react';
import { useXRHitTest } from '@react-three/xr';
import useStore from '../hooks/useStore';
import { Matrix4, Vector3, DoubleSide } from 'three';

const matrixHelper = new Matrix4();

const ARReticle = ({ children }) => {
  const reticleRef = useRef();
  const { isAR, placedPosition, setPlacedPosition, activeTool, addObject } = useStore();

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (!isAR) return;

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
    if (!isAR || !reticleRef.current || !reticleRef.current.visible) return;

    if (!placedPosition) {
      const anchorPos = reticleRef.current.position.clone();
      setPlacedPosition(anchorPos);

      if (activeTool) {
        addObject(activeTool, [0, 0, 0]);
      }
      return;
    }

    if (activeTool) {
      const localPos = reticleRef.current.position.clone().sub(placedPosition);
      addObject(activeTool, [localPos.x, localPos.y, localPos.z]);
    }
  };

  if (!isAR) {
    return <group>{children}</group>;
  }

  return (
    <group onPointerDown={placeScene}>
      {isAR && (
        <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.6} side={DoubleSide} />
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
