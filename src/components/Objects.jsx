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

  const groupRef = useRef();
  const isDragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector3());
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ plane at y=0 local

  const handlePointerDown = (e) => {
    e.stopPropagation();
    selectObject(id);
    if (isAR) {
      isDragging.current = true;
      e.target.setPointerCapture(e.pointerId);
      
      const parentGroup = groupRef.current?.parent;
      if (parentGroup) {
        const localPoint = parentGroup.worldToLocal(e.point.clone());
        dragOffset.current.copy(localPoint).sub(new THREE.Vector3(...position));
      }
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging.current && isAR) {
      e.stopPropagation();
      const parentGroup = groupRef.current?.parent;
      if (parentGroup) {
        const ray = e.ray.clone();
        const inverseMatrix = new THREE.Matrix4().copy(parentGroup.matrixWorld).invert();
        ray.applyMatrix4(inverseMatrix);
        
        const intersect = new THREE.Vector3();
        ray.intersectPlane(plane, intersect);
        
        if (intersect) {
          const newPos = intersect.sub(dragOffset.current);
          updateObject(id, { position: [newPos.x, position[1], newPos.z] });
        }
      }
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging.current && isAR) {
      e.stopPropagation();
      isDragging.current = false;
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const renderMesh = () => {
    const commonProps = {
      castShadow: true,
      receiveShadow: true,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerOut: handlePointerUp,
    };

    switch (type) {
      case OBJECT_TYPES.WALL:
      case OBJECT_TYPES.DOOR:
      case OBJECT_TYPES.WINDOW:
      case OBJECT_TYPES.ROOF:
      case OBJECT_TYPES.FLOOR:
      case OBJECT_TYPES.FURNITURE:
      case OBJECT_TYPES.STAIRCASE:
        return (
          <mesh {...commonProps}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
      case OBJECT_TYPES.PILLAR:
        return (
          <mesh {...commonProps}>
            <cylinderGeometry args={[radius, radius, height, 32]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
      default:
        return (
          <mesh {...commonProps}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
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
