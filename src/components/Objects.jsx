import React, { useRef } from 'react';
import * as THREE from 'three';
import useStore from '../hooks/useStore';
import { OBJECT_TYPES } from '../data/constants';
import { PivotControls } from '@react-three/drei';
import { useXR } from '@react-three/xr';

export const ConstructionObject = ({ objectData }) => {
  const { id, type, position, rotation, width, height, depth, radius, color } = objectData;
  const updateObject = useStore.getState().updateObject;
  const selectObject = useStore.getState().selectObject;
  const selectedId = useStore((state) => state.selectedId);
  const isSelected = selectedId === id;
  const isAR = useXR(state => state.mode === 'immersive-ar' || state.mode === 'immersive-vr');

  const handleDrag = (matrix) => {
    // Extract position from matrix
    const pos = new THREE.Vector3();
    const rot = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(pos, rot, scale);
    
    // Euler from Quaternion
    const euler = new THREE.Euler().setFromQuaternion(rot);

    updateObject(id, {
      position: [pos.x, pos.y, pos.z],
      rotation: [euler.x, euler.y, euler.z]
    });
  };

  const renderMesh = () => {
    switch (type) {
      case OBJECT_TYPES.WALL:
      case OBJECT_TYPES.DOOR:
      case OBJECT_TYPES.WINDOW:
      case OBJECT_TYPES.ROOF:
      case OBJECT_TYPES.FLOOR:
      case OBJECT_TYPES.FURNITURE:
      case OBJECT_TYPES.STAIRCASE:
        return (
          <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); selectObject(id); }}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
      case OBJECT_TYPES.PILLAR:
        return (
          <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); selectObject(id); }}>
            <cylinderGeometry args={[radius, radius, height, 32]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
      default:
        return (
          <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); selectObject(id); }}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
    }
  };

  return (
    <group position={position} rotation={rotation}>
      {isSelected && !isAR ? (
        <PivotControls
          visible={true}
          scale={1.5}
          lineWidth={2}
          anchor={[0, 0, 0]}
          onDragEnd={() => {}}
          onDrag={(l) => {
            // we can update state on drag end for performance, or on drag for realtime
            const pos = new THREE.Vector3();
            const rot = new THREE.Quaternion();
            const scale = new THREE.Vector3();
            l.decompose(pos, rot, scale);
            const euler = new THREE.Euler().setFromQuaternion(rot);
            // position is relative to original, need to calculate absolute if using matrix
            // PivotControls actually manages local matrix, so its simpler to update state onDragEnd if we read object ref
          }}
        >
          {renderMesh()}
        </PivotControls>
      ) : (
        renderMesh()
      )}
    </group>
  );
};
